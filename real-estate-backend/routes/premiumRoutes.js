const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/public/premiumController');
const { attachUserSubscription } = require('../middleware/dataMasking');

// Apply subscription middleware to all premium routes
router.use(attachUserSubscription);

// --- Property Premium Features ---
router.get('/properties/equity', premiumController.getPropertiesWithEquity);

// --- Auction Premium Features ---
router.get('/auctions/leads', premiumController.getAuctionLeads);

// --- Owner Premium Features ---
router.get('/owners/leads', premiumController.getOwnerLeads);

// --- Loan Premium Features ---
router.get('/loans/leads', premiumController.getLoanLeads);

module.exports = router;
