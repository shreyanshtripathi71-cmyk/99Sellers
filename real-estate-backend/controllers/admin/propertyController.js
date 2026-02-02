const fs = require('fs');
const csv = require('fast-csv');
const Property = require('../../models/property'); // Based on your 'property' table
const db = require('../../models');

exports.postProperty = async (req, res) => {
    try {
        // --- OPTION 1: BULK CSV UPLOAD ---
        // Triggered if the admin selects a file in the dashboard
        if (req.file) {
            const properties = [];
            const filePath = req.file.path;

            fs.createReadStream(filePath)
                .pipe(csv.parse({ headers: true })) // Maps CSV headers to DB columns
                .on('data', (row) => properties.push(row))
                .on('end', async () => {
                    // Bulk insert into the database
                    await db.Property.bulkCreate(properties); 
                    
                    // Delete the temp file from the server
                    fs.unlinkSync(filePath); 
                    
                    return res.status(201).json({ 
                        success: true, 
                        message: "CSV properties imported successfully" 
                    });
                })
                .on('error', (err) => {
                    return res.status(400).json({ error: "CSV Parsing failed", details: err.message });
                });
        } 
        // --- OPTION 2: MANUAL ENTRY ---
        // Triggered if the admin fills out a manual form
        else {
            if (!req.body || Object.keys(req.body).length === 0) {
                return res.status(400).json({ error: "No data provided" });
            }

            const newProperty = await db.Property.create(req.body); 
            return res.status(201).json({ 
                success: true, 
                message: "Property created manually", 
                data: newProperty 
            });
        }
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err.message });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        // Manual deletion of a specific record
        const deleted = await db.Property.destroy({ where: { id: id } }); 

        if (deleted) {
            res.status(200).json({ message: "Property deleted successfully" });
        } else {
            res.status(404).json({ error: "Property not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "No update data provided" });
        }

        const [updatedRowsCount] = await db.Property.update(req.body, {
            where: { id: id }
        });

        if (updatedRowsCount > 0) {
            const updatedProperty = await db.Property.findByPk(id);
            res.status(200).json({ 
                message: "Property updated successfully", 
                data: updatedProperty 
            });
        } else {
            res.status(404).json({ error: "Property not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err.message });
    }
};

exports.getAllProperties = async (req, res) => {
    try {
        const properties = await db.Property.findAll({
            order: [['id', 'DESC']]
        });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPropertyStats = async (req, res) => {
    try {
        const totalProperties = await db.Property.count();
        const totalValue = await db.Property.sum('PPrice');
        const avgPrice = await db.Property.aggregate('PPrice', 'avg');
        
        // Get properties by type
        const propertiesByType = await db.Property.findAll({
            attributes: [
                'PType',
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
                [db.sequelize.fn('AVG', db.sequelize.col('PPrice')), 'avgPrice']
            ],
            group: ['PType']
        });

        res.json({
            totalProperties,
            totalValue,
            avgPrice,
            propertiesByType
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};