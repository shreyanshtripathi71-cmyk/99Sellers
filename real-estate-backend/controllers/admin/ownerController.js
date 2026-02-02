const db = require('../../models');

/**
 * Get all property owners
 */
exports.getAllOwners = async (req, res) => {
    try {
        const owners = await db.Owner.findAll({
            include: [{
                model: db.Property,
                attributes: ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState']
            }],
            order: [['id', 'DESC']]
        });
        res.json(owners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get owner by ID
 */
exports.getOwnerById = async (req, res) => {
    try {
        const owner = await db.Owner.findByPk(req.params.id, {
            include: [{
                model: db.Property,
                attributes: ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PPrice']
            }]
        });
        
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }
        
        res.json(owner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create new owner
 */
exports.createOwner = async (req, res) => {
    try {
        const {
            OLastName, OMiddleName, OFirstName,
            OStreetAddr1, OStreetAddr2, OCity, OState, OZip,
            OProperty_id, insert_id
        } = req.body;

        const newOwner = await db.Owner.create({
            OLastName, OMiddleName, OFirstName,
            OStreetAddr1, OStreetAddr2, OCity, OState, OZip,
            OProperty_id, insert_id
        });

        res.status(201).json({
            message: "Owner created successfully",
            data: newOwner
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update owner
 */
exports.updateOwner = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [updatedRowsCount] = await db.Owner.update(req.body, {
            where: { id: id }
        });

        if (updatedRowsCount > 0) {
            const updatedOwner = await db.Owner.findByPk(id);
            res.json({
                message: "Owner updated successfully",
                data: updatedOwner
            });
        } else {
            res.status(404).json({ error: "Owner not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete owner
 */
exports.deleteOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await db.Owner.destroy({ where: { id: id } });

        if (deleted) {
            res.json({ message: "Owner deleted successfully" });
        } else {
            res.status(404).json({ error: "Owner not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get owners by property ID
 */
exports.getOwnersByProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const owners = await db.Owner.findAll({
            where: { OProperty_id: propertyId },
            order: [['id', 'DESC']]
        });

        res.json(owners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOwnerStats = async (req, res) => {
    try {
        const totalOwners = await db.Owner.count();
        
        // Get owners by state
        const ownersByState = await db.Owner.findAll({
            attributes: [
                'OState',
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
            ],
            group: ['OState']
        });

        res.json({
            totalOwners,
            ownersByState
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
