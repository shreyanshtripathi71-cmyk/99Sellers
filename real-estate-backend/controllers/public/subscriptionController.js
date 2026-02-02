const db = require('../../models');
const { Subscription, UserLogin } = db;

/**
 * Subscription Controller - Handles subscription management
 */

// Start a free trial
exports.startTrial = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        error: 'User ID required',
        message: 'Please provide a valid user ID'
      });
    }

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      where: { userId }
    });

    if (existingSubscription) {
      return res.status(400).json({
        error: 'Subscription exists',
        message: 'User already has an active subscription'
      });
    }

    // Create trial subscription (15 days)
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 15);

    const subscription = await Subscription.create({
      userId,
      planType: 'premium',
      startDate: new Date(),
      endDate: trialEndDate,
      status: 'active',
      features: {
        searchLimit: 2500,
        exportLimit: 1000,
        apiCallsPerDay: 500,
        advancedSearch: true,
        fullDataAccess: true,
        exportEnabled: true,
        leadGeneration: true,
        realTimeAlerts: true
      },
      price: 0.00,
      billingCycle: 'monthly',
      autoRenew: false
    });

    res.json({
      success: true,
      message: 'Free trial started successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Error starting trial:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to start trial'
    });
  }
};

// Get trial usage
exports.getTrialUsage = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Please log in to view trial usage'
      });
    }

    const subscription = await Subscription.findOne({
      where: { userId }
    });

    if (!subscription) {
      return res.status(404).json({
        error: 'No subscription found',
        message: 'User does not have an active subscription'
      });
    }

    const now = new Date();
    const startDate = new Date(subscription.startDate);
    const endDate = new Date(subscription.endDate);
    const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const daysUsed = totalDays - daysRemaining;

    res.json({
      success: true,
      data: {
        daysUsed,
        daysRemaining,
        totalDays,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        status: subscription.status
      }
    });
  } catch (error) {
    console.error('Error getting trial usage:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to get trial usage'
    });
  }
};

// Create a new subscription
exports.createSubscription = async (req, res) => {
  try {
    const { userId, planType, billingCycle } = req.body;

    if (!userId || !planType) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'userId and planType are required'
      });
    }

    // Check if user already has a subscription
    const existingSubscription = await Subscription.findOne({
      where: { userId }
    });

    if (existingSubscription) {
      return res.status(400).json({
        error: 'Subscription exists',
        message: 'User already has an active subscription. Use update endpoint instead.'
      });
    }

    // Define plan prices and features
    const plans = {
      free: { price: 0, features: { searchLimit: 50, exportLimit: 0, fullDataAccess: false } },
      basic: { price: 49, features: { searchLimit: 500, exportLimit: 100, fullDataAccess: false } },
      premium: { price: 99, features: { searchLimit: 2500, exportLimit: 1000, fullDataAccess: true } },
      enterprise: { price: 249, features: { searchLimit: -1, exportLimit: -1, fullDataAccess: true } }
    };

    const planConfig = plans[planType];
    if (!planConfig) {
      return res.status(400).json({
        error: 'Invalid plan type',
        message: 'Please choose a valid plan'
      });
    }

    // Calculate end date based on billing cycle
    const endDate = new Date();
    if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const subscription = await Subscription.create({
      userId,
      planType,
      startDate: new Date(),
      endDate,
      status: 'active',
      features: planConfig.features,
      price: planConfig.price,
      billingCycle: billingCycle || 'monthly',
      autoRenew: true
    });

    res.json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to create subscription'
    });
  }
};

// Get subscription status
exports.getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Please log in to view subscription status'
      });
    }

    const subscription = await Subscription.findOne({
      where: { userId },
      include: [{ model: UserLogin, attributes: ['FirstName', 'LastName', 'Email'] }]
    });

    if (!subscription) {
      return res.json({
        success: true,
        data: {
          planType: 'free',
          status: 'active',
          features: {
            searchLimit: 50,
            exportLimit: 0,
            fullDataAccess: false
          }
        }
      });
    }

    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to get subscription status'
    });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        error: 'User ID required',
        message: 'Please provide a valid user ID'
      });
    }

    const subscription = await Subscription.findOne({
      where: { userId }
    });

    if (!subscription) {
      return res.status(404).json({
        error: 'No subscription found',
        message: 'User does not have an active subscription'
      });
    }

    // Update subscription status
    await subscription.update({
      status: 'cancelled',
      autoRenew: false
    });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to cancel subscription'
    });
  }
};

// Update subscription
exports.updateSubscription = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { planType, billingCycle } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'User ID required',
        message: 'Please provide a valid user ID'
      });
    }

    const subscription = await Subscription.findOne({
      where: { userId }
    });

    if (!subscription) {
      return res.status(404).json({
        error: 'No subscription found',
        message: 'User does not have an active subscription'
      });
    }

    // Define plan prices and features
    const plans = {
      free: { price: 0, features: { searchLimit: 50, exportLimit: 0, fullDataAccess: false } },
      basic: { price: 49, features: { searchLimit: 500, exportLimit: 100, fullDataAccess: false } },
      premium: { price: 99, features: { searchLimit: 2500, exportLimit: 1000, fullDataAccess: true } },
      enterprise: { price: 249, features: { searchLimit: -1, exportLimit: -1, fullDataAccess: true } }
    };

    const updateData = {};
    if (planType && plans[planType]) {
      updateData.planType = planType;
      updateData.features = plans[planType].features;
      updateData.price = plans[planType].price;
    }
    if (billingCycle) {
      updateData.billingCycle = billingCycle;
    }

    await subscription.update(updateData);

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to update subscription'
    });
  }
};

// Get available plans
exports.getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        billingCycle: 'monthly',
        features: {
          searchLimit: 50,
          exportLimit: 0,
          fullDataAccess: false,
          apiCallsPerDay: 10
        },
        description: 'Basic access to property data'
      },
      {
        id: 'basic',
        name: 'Basic',
        price: 49,
        billingCycle: 'monthly',
        features: {
          searchLimit: 500,
          exportLimit: 100,
          fullDataAccess: false,
          apiCallsPerDay: 100,
          advancedSearch: false
        },
        description: 'For individual investors getting started'
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 99,
        billingCycle: 'monthly',
        features: {
          searchLimit: 2500,
          exportLimit: 1000,
          fullDataAccess: true,
          apiCallsPerDay: 500,
          advancedSearch: true,
          exportEnabled: true
        },
        description: 'For serious investors scaling their business'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 249,
        billingCycle: 'monthly',
        features: {
          searchLimit: -1,
          exportLimit: -1,
          fullDataAccess: true,
          apiCallsPerDay: -1,
          advancedSearch: true,
          exportEnabled: true,
          apiAccess: true
        },
        description: 'For teams and high-volume operations'
      }
    ];

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Error getting plans:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to get plans'
    });
  }
};

// Get payment methods (placeholder)
exports.getPaymentMethods = async (req, res) => {
  res.json({
    success: true,
    data: [],
    message: 'Payment methods feature coming soon'
  });
};

// Add payment method (placeholder)
exports.addPaymentMethod = async (req, res) => {
  res.json({
    success: true,
    message: 'Payment method feature coming soon'
  });
};

// Set default payment method (placeholder)
exports.setDefaultPaymentMethod = async (req, res) => {
  res.json({
    success: true,
    message: 'Payment method feature coming soon'
  });
};
