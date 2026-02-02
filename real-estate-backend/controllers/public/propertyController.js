const db = require('../../models');


exports.getProperties = async (req, res) => {
    try {
        const { type, city } = req.query; // Capture search filters from URL
        const filters = {};

        if (type) filters.PType = type; // Filter by distress type (Probate/Divorce)
        if (city) filters.PCity = city; // Filter by city

        const properties = await db.Property.findAll({
            where: filters,
            order: [['id', 'DESC']] // Use id instead of createdAt since timestamps are disabled
        });
        
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get full details of a single distressed property.
 */
exports.getPropertyById = async (req, res) => {
    try {
        const property = await db.Property.findByPk(req.params.id);
        
        if (!property) return res.status(404).json({ error: "Property not found" });
        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};