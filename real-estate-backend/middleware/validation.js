const { body, validationResult } = require('express-validator');

exports.validateProperty = [
    body('PStreetNum').notEmpty(),
    body('PStreetName').notEmpty(),
    body('PCity').notEmpty(),
    // Add more validations
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];