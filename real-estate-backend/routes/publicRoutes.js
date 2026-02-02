const express = require('express');
const router = express.Router();

// Import all controllers to ensure functions are defined
const authController = require('../controllers/public/authController');
const geoController = require('../controllers/public/geoController');
const propertyController = require('../controllers/public/propertyController');
const auctionController = require('../controllers/public/auctionController');
const settingsAdmin = require('../controllers/admin/settingsController');

// --- Authentication ---
// Ensure these functions are exported in controllers/public/authController.js
router.post('/login', authController.login);
router.post('/register', authController.register);

// --- Properties (Read-Only) ---
// Using the dedicated propertyController instead of inline logic
router.get('/properties', propertyController.getProperties);
router.get('/properties/:id', propertyController.getPropertyById);

// --- Geolocation (Text-Based Search) ---
// This handles the Zip/City/County matching for the proaddress table
router.get('/nearby', geoController.getPropertiesNearby);

// --- Auctions (Read-Only) ---
// Public access to upcoming auctions
router.get('/auctions', auctionController.getLiveAuctions);

// --- Poppins (Public - get active popups for page) ---
router.get('/poppins', settingsAdmin.getActivePoppins);

module.exports = router;