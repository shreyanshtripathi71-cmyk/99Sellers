const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/public/subscriptionController');
const { attachUserSubscription } = require('../middleware/dataMasking');

// Apply subscription middleware to all subscription routes
router.use(attachUserSubscription);

// --- Trial Management ---
router.post('/trial/start', subscriptionController.startTrial);
router.get('/trial/usage', subscriptionController.getTrialUsage);

// --- Subscription Management ---
router.post('/create', subscriptionController.createSubscription);
router.get('/status', subscriptionController.getSubscriptionStatus);
router.post('/cancel', subscriptionController.cancelSubscription);
router.put('/update', subscriptionController.updateSubscription);

// --- Plans ---
router.get('/plans', subscriptionController.getPlans);

// --- Payment Methods ---
router.get('/payment-methods', subscriptionController.getPaymentMethods);
router.post('/payment-methods', subscriptionController.addPaymentMethod);
router.put('/payment-methods/default', subscriptionController.setDefaultPaymentMethod);

module.exports = router;
