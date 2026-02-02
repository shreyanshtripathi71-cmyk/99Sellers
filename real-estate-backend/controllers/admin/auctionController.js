const fs = require('fs');
const csv = require('fast-csv');
const db = require('../../models');

exports.postAuction = async (req, res) => {
    try {
        if (req.file) {
            const auctions = [];
            fs.createReadStream(req.file.path)
                .pipe(csv.parse({ headers: true }))
                .on('data', (row) => auctions.push(row))
                .on('end', async () => {
                    await db.Auction.bulkCreate(auctions); // Bulk import
                    fs.unlinkSync(req.file.path);
                    return res.status(201).json({ message: "Auctions imported via CSV" });
                });
        } else {
            const auction = await db.Auction.create(req.body); // Manual entry
            res.status(201).json({ message: "Auction created manually", data: auction });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAuction = async (req, res) => {
    try {
        const { id } = req.params;
        await db.Auction.destroy({ where: { AAuctionID: id } }); // Use correct primary key
        res.status(200).json({ message: "Auction deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAuction = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ error: "No update data provided" });
        }

        const [updatedRowsCount] = await db.Auction.update(req.body, {
            where: { AAuctionID: id }
        });

        if (updatedRowsCount > 0) {
            const updatedAuction = await db.Auction.findByPk(id);
            res.status(200).json({ 
                message: "Auction updated successfully", 
                data: updatedAuction 
            });
        } else {
            res.status(404).json({ error: "Auction not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server Error", details: err.message });
    }
};

exports.getAllAuctions = async (req, res) => {
    try {
        const auctions = await db.Auction.findAll({
            include: [{
                model: db.Property,
                attributes: ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PPrice']
            }],
            order: [['AAuctionID', 'DESC']]
        });
        res.json(auctions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUpcomingAuctions = async (req, res) => {
    try {
        const auctions = await db.Auction.findAll({
            where: {
                AAuctionDateTime: {
                    [db.Sequelize.Op.gt]: new Date()
                }
            },
            include: [{
                model: db.Property,
                attributes: ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PPrice']
            }],
            order: [['AAuctionDateTime', 'ASC']]
        });
        res.json(auctions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};