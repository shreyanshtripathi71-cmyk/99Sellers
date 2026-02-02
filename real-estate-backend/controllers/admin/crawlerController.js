const db = require('../../models');

/**
 * Fetches all recent crawler runs for the admin dashboard.
 * Maps to the 'crawler_run' table.
 */
exports.getAllRuns = async (req, res) => {
    try {
        const runs = await db.CrawlerRun.findAll({
            order: [['CrawlerId', 'DESC']] // Show latest runs first
        }); 
        res.json(runs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Fetches all recorded crawler errors for admin review.
 * Maps to the 'erroneous' table.
 */
exports.getErrors = async (req, res) => {
    try {
        // Retrieves data such as 'Erroneous_id', 'OwnerName', and 'error'
        const errors = await db.ErroneousLinks.findAll({
            order: [['id', 'DESC']]
        });
        res.json(errors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};