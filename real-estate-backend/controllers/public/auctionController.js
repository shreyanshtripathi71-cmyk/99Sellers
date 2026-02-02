const db = require('../../models');

/**
 * View all upcoming auctions.
 */
exports.getLiveAuctions = async (req, res) => {
    try {
        const auctions = await db.Auction.findAll({
            where: {
                // Only show future auctions based on AAuctionDateTime field
                AAuctionDateTime: { [db.Sequelize.Op.gt]: new Date() } 
            },
            include: [{
                model: db.Property,
                as: 'Property',
                attributes: ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PZip', 'PType', 'PPrice']
            }]
        });
        res.status(200).json(auctions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};