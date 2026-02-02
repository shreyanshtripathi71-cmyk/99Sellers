const CrawlerConfig = require('../../models/CrawlerConfig'); // Table: crawler_config

exports.updateConfig = async (req, res) => {
    try {
        // Admin manually updates crawler settings from dashboard
        const updated = await CrawlerConfig.update(req.body, {
            where: { id: req.params.id }
        });
        res.status(200).json({ message: "Configuration updated", data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};