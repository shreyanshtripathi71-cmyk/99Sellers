const db = require('../../models');

/**
 * Get all loans
 */
exports.getAllLoans = async (req, res) => {
    try {
        const loans = await db.Loan.findAll({
            include: [{
                model: db.Property,
                attributes: ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PPrice']
            }],
            order: [['datetime', 'DESC']]
        });
        res.json(loans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get loan by ID
 */
exports.getLoanById = async (req, res) => {
    try {
        const loan = await db.Loan.findByPk(req.params.id, {
            include: [{
                model: db.Property,
                attributes: ['id', 'PStreetNum', 'PStreetName', 'PCity', 'PState', 'PPrice', 'PDescription']
            }]
        });
        
        if (!loan) {
            return res.status(404).json({ error: "Loan not found" });
        }
        
        res.json(loan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create new loan
 */
exports.createLoan = async (req, res) => {
    try {
        const {
            property_id, deed_id, borrower_name,
            lender_name, lender_address, datetime, loan_amount
        } = req.body;

        const newLoan = await db.Loan.create({
            property_id, deed_id, borrower_name,
            lender_name, lender_address, datetime, loan_amount
        });

        res.status(201).json({
            message: "Loan created successfully",
            data: newLoan
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update loan
 */
exports.updateLoan = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [updatedRowsCount] = await db.Loan.update(req.body, {
            where: { id: id }
        });

        if (updatedRowsCount > 0) {
            const updatedLoan = await db.Loan.findByPk(id);
            res.json({
                message: "Loan updated successfully",
                data: updatedLoan
            });
        } else {
            res.status(404).json({ error: "Loan not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete loan
 */
exports.deleteLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await db.Loan.destroy({ where: { id: id } });

        if (deleted) {
            res.json({ message: "Loan deleted successfully" });
        } else {
            res.status(404).json({ error: "Loan not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get loans by property ID
 */
exports.getLoansByProperty = async (req, res) => {
    try {
        const { propertyId } = req.params;
        const loans = await db.Loan.findAll({
            where: { property_id: propertyId },
            order: [['datetime', 'DESC']]
        });

        res.json(loans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get loan statistics
 */
exports.getLoanStats = async (req, res) => {
    try {
        const totalLoans = await db.Loan.count();
        const totalLoanAmount = await db.Loan.sum('loan_amount') || 0;
        
        // Get average loan amount safely
        const avgLoanAmountResult = await db.Loan.aggregate('loan_amount', 'avg');
        const avgLoanAmount = avgLoanAmountResult || 0;
        
        // Get loans by month for the last 12 months
        const monthlyLoans = await db.Loan.findAll({
            attributes: [
                [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('datetime'), '%Y-%m'), 'month'],
                [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
                [db.sequelize.fn('SUM', db.sequelize.col('loan_amount')), 'total']
            ],
            where: {
                datetime: {
                    [db.Sequelize.Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 12))
                }
            },
            group: [db.sequelize.fn('DATE_FORMAT', db.sequelize.col('datetime'), '%Y-%m')],
            order: [[db.sequelize.fn('DATE_FORMAT', db.sequelize.col('datetime'), '%Y-%m'), 'ASC']]
        });

        res.json({
            totalLoans,
            totalLoanAmount,
            avgLoanAmount,
            monthlyLoans: monthlyLoans || []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
