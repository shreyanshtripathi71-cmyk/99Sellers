const db = require('../../models');

/**
 * Proximity Search: Text-Based Matching
 * Finds properties by matching location strings provided in the request query.
 */
exports.getPropertiesNearby = async (req, res) => {
    try {
        // Extract filters from the request URL (e.g., /api/nearby?zip=302001)
        const { zip, city, county } = req.query;
        const filters = {};

        // exact match for Zip Code
        if (zip) filters.Pzip = zip;
        
        // exact match for City name
        if (city) filters.Pcity = city;
        
        // exact match for County
        if (county) filters.counties = county;

        // Ensure at least one filter is provided to avoid returning the entire database
        if (Object.keys(filters).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide a Zip Code, City, or County to see nearby properties." 
            });
        }

        const properties = await db.Proaddress.findAll({
            where: filters,
            attributes: [
                'id', 'PStreetNum', 'PStreetName', 'Pcity', 
                'PState', 'Pzip', 'price', 'PMotiveType', 
                'beds', 'baths', 'square_feet'
            ],
            order: [['DATE_TIMEOFEXTRACTION', 'DESC']] // Show most recently added properties first
        });

        res.status(200).json({
            success: true,
            method: "Text-based location matching",
            count: properties.length,
            results: properties
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            error: "Search failed", 
            details: err.message 
        });
    }
};