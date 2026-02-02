const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Stores files temporarily

const propertyAdmin = require('../controllers/admin/propertyController');
const crawlerAdmin = require('../controllers/admin/crawlerController');
const auctionAdmin = require('../controllers/admin/auctionController');
const ownerAdmin = require('../controllers/admin/ownerController');
const loanAdmin = require('../controllers/admin/loanController');
const userAdmin = require('../controllers/admin/userController');
const subscriptionAdmin = require('../controllers/admin/subscriptionManagementController');
const dataExportAdmin = require('../controllers/admin/dataExportController');
const dataImportAdmin = require('../controllers/admin/dataImportController');
const settingsAdmin = require('../controllers/admin/settingsController');
const { isAdmin } = require('../middleware/auth');

// Apply security middleware (Checking user_login table UserType)
router.use(isAdmin);

// --- Property Admin Endpoints ---
router.post('/properties', upload.single('file'), propertyAdmin.postProperty);
router.delete('/properties/:id', propertyAdmin.deleteProperty);
router.put('/properties/:id', propertyAdmin.updateProperty); 
router.get('/properties', propertyAdmin.getAllProperties); 
router.get('/properties/stats', propertyAdmin.getPropertyStats); 

// --- Auction Admin Endpoints ---
router.post('/auctions', upload.single('file'), auctionAdmin.postAuction);
router.delete('/auctions/:id', auctionAdmin.deleteAuction);
router.put('/auctions/:id', auctionAdmin.updateAuction); 
router.get('/auctions', auctionAdmin.getAllAuctions); 
router.get('/auctions/upcoming', auctionAdmin.getUpcomingAuctions);

// --- Owner Admin Endpoints ---
router.get('/owners', ownerAdmin.getAllOwners);
router.get('/owners/stats', ownerAdmin.getOwnerStats); // Add stats route
router.get('/owners/:id', ownerAdmin.getOwnerById);
router.post('/owners', ownerAdmin.createOwner);
router.put('/owners/:id', ownerAdmin.updateOwner);
router.delete('/owners/:id', ownerAdmin.deleteOwner);
router.get('/owners/property/:propertyId', ownerAdmin.getOwnersByProperty);

// --- Loan Admin Endpoints ---
router.get('/loans', loanAdmin.getAllLoans);
router.get('/loans/stats', loanAdmin.getLoanStats); // Move stats before :id
router.get('/loans/:id', loanAdmin.getLoanById);
router.post('/loans', loanAdmin.createLoan);
router.put('/loans/:id', loanAdmin.updateLoan);
router.delete('/loans/:id', loanAdmin.deleteLoan);
router.get('/loans/property/:propertyId', loanAdmin.getLoansByProperty);

// --- User Admin Endpoints ---
router.get('/users', userAdmin.getAllUsers);
router.get('/users/stats', userAdmin.getUserStats); // Move stats before :id
router.get('/users/:id', userAdmin.getUserById);
router.post('/users', userAdmin.createUser);
router.put('/users/:id', userAdmin.updateUser);
router.delete('/users/:id', userAdmin.deleteUser);
router.put('/users/:id/toggle-status', userAdmin.toggleUserStatus);

// --- Subscription Admin Endpoints ---
router.get('/subscriptions', subscriptionAdmin.getAllSubscriptions);
router.get('/subscriptions/stats', subscriptionAdmin.getSubscriptionStats);
router.get('/subscriptions/plans', subscriptionAdmin.getAllPlans);
router.post('/subscriptions/plans', subscriptionAdmin.createOrUpdatePlan);
router.delete('/subscriptions/plans/:id', subscriptionAdmin.deletePlan);
router.get('/subscriptions/user/:userId', subscriptionAdmin.getUserSubscription);
router.post('/subscriptions/user/:userId/trial', subscriptionAdmin.createTrialForUser);
router.put('/subscriptions/user/:userId/cancel', subscriptionAdmin.cancelUserSubscription);

// --- Crawler Admin Endpoints ---
router.get('/crawler/runs', crawlerAdmin.getAllRuns);
router.get('/crawler/errors', crawlerAdmin.getErrors);

// --- Data Import Admin Endpoints ---
router.post('/import', upload.single('file'), dataImportAdmin.importData);
router.get('/import/template/:target', dataImportAdmin.getTemplate);

// --- Settings Admin Endpoints ---
router.get('/settings', settingsAdmin.getSettings);
router.put('/settings', settingsAdmin.updateSettings);
router.get('/settings/download-access', settingsAdmin.checkDownloadAccess);

// --- Poppins Admin Endpoints ---
router.get('/poppins', settingsAdmin.getAllPoppins);
router.post('/poppins', settingsAdmin.savePoppin);
router.delete('/poppins/:id', settingsAdmin.deletePoppin);

module.exports = router;
