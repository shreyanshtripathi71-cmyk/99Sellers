const db = require('../../models');
const stripeService = require('../../services/stripeService');
const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('fast-csv');

/**
 * Get all subscriptions with user details
 */
exports.getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await db.Subscription.findAll({
            include: [
                {
                    model: db.UserLogin,
                    as: 'user',
                    attributes: ['id', 'Email', 'FirstName', 'LastName', 'UserType'],
                    include: [{
                        model: db.Trial,
                        as: 'trial',
                        required: false
                    }]
                },
                {
                    model: db.SubscriptionPlan,
                    as: 'plan',
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            total: subscriptions.length,
            subscriptions: subscriptions.map(sub => ({
                id: sub.id,
                userId: sub.userId,
                userEmail: sub.user?.Email,
                userName: `${sub.user?.FirstName} ${sub.user?.LastName}`,
                planName: sub.plan?.name,
                planType: sub.planType,
                status: sub.status,
                price: sub.price,
                billingCycle: sub.billingCycle,
                startDate: sub.startDate,
                endDate: sub.endDate,
                stripeSubscriptionId: sub.stripeSubscriptionId,
                trialInfo: sub.trial ? {
                    trialType: sub.trial.trialType,
                    startDate: sub.trial.startDate,
                    endDate: sub.trial.endDate,
                    daysRemaining: Math.ceil((new Date(sub.trial.endDate) - new Date()) / (1000 * 60 * 60 * 24)),
                    status: sub.trial.status,
                    usageStats: sub.trial.usageStats
                } : null,
                createdAt: sub.createdAt,
                updatedAt: sub.updatedAt
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get subscription statistics
 */
exports.getSubscriptionStats = async (req, res) => {
    try {
        const totalSubscriptions = await db.Subscription.count();
        const activeSubscriptions = await db.Subscription.count({ where: { status: 'active' } });
        const cancelledSubscriptions = await db.Subscription.count({ where: { status: 'cancelled' } });
        const expiredSubscriptions = await db.Subscription.count({ where: { status: 'expired' } });
        const trialingSubscriptions = await db.Subscription.count({ where: { status: 'trialing' } });

        // Revenue calculations
        const activeSubsWithPlans = await db.Subscription.findAll({
            where: { status: 'active' },
            include: [{ model: db.SubscriptionPlan, as: 'plan' }]
        });

        const monthlyRevenue = activeSubsWithPlans.reduce((total, sub) => {
            const monthlyAmount = sub.billingCycle === 'yearly' ? sub.price / 12 : sub.price;
            return total + monthlyAmount;
        }, 0);

        const yearlyRevenue = monthlyRevenue * 12;

        // Trial conversion rate
        const totalTrials = await db.Trial.count();
        const convertedTrials = await db.Trial.count({ where: { status: 'converted' } });
        const conversionRate = totalTrials > 0 ? (convertedTrials / totalTrials) * 100 : 0;

        // Plan distribution
        const planDistribution = await db.Subscription.findAll({
            where: { status: 'active' },
            include: [{ model: db.SubscriptionPlan, as: 'plan' }]
        }).then(subs => {
            const distribution = {};
            subs.forEach(sub => {
                const planName = sub.plan?.name || 'Unknown';
                distribution[planName] = (distribution[planName] || 0) + 1;
            });
            return distribution;
        });

        res.json({
            totalSubscriptions,
            activeSubscriptions,
            cancelledSubscriptions,
            expiredSubscriptions,
            trialingSubscriptions,
            monthlyRevenue,
            yearlyRevenue,
            conversionRate,
            planDistribution,
            averageRevenuePerUser: activeSubscriptions > 0 ? monthlyRevenue / activeSubscriptions : 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Create or update subscription plan
 */
exports.createOrUpdatePlan = async (req, res) => {
    try {
        const { id, name, type, billingCycle, price, currency, description, features, limits, trialDays, popular, sortOrder } = req.body;

        let plan;
        if (id) {
            // Update existing plan
            plan = await db.SubscriptionPlan.findByPk(id);
            if (!plan) {
                return res.status(404).json({ error: 'Plan not found' });
            }

            await plan.update({
                name,
                type,
                billingCycle,
                price,
                currency,
                description,
                features,
                limits,
                trialDays,
                popular,
                sortOrder
            });
        } else {
            // Create new plan
            plan = await db.SubscriptionPlan.create({
                name,
                type,
                billingCycle,
                price,
                currency,
                description,
                features,
                limits,
                trialDays,
                popular,
                sortOrder: sortOrder || 0
            });
        }

        // Update Stripe if plan exists
        if (plan.stripeProductId && plan.stripePriceId) {
            try {
                const stripeProduct = await stripeService.stripe.products.update(plan.stripeProductId, {
                    name,
                    description,
                    metadata: {
                        plan_type: type,
                        features: JSON.stringify(features)
                    }
                });

                const stripePrice = await stripeService.stripe.prices.update(plan.stripePriceId, {
                    unit_amount: price * 100, // Convert to cents
                    currency: currency.toLowerCase(),
                    metadata: {
                        plan_type: type,
                        billing_cycle: billingCycle
                    }
                });

                console.log('✅ Stripe product and price updated');
            } catch (stripeError) {
                console.error('⚠️  Stripe update failed:', stripeError.message);
            }
        }

        res.json({
            message: id ? 'Plan updated successfully' : 'Plan created successfully',
            plan
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Delete subscription plan
 */
exports.deletePlan = async (req, res) => {
    try {
        const { id } = req.params;
        
        const plan = await db.SubscriptionPlan.findByPk(id);
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        // Check if plan is in use
        const activeSubscriptions = await db.Subscription.count({ 
            where: { planId: id, status: 'active' } 
        });

        if (activeSubscriptions > 0) {
            return res.status(400).json({ 
                error: 'Cannot delete plan with active subscriptions' 
            });
        }

        // Delete from Stripe if exists
        if (plan.stripeProductId) {
            try {
                await stripeService.stripe.products.del(plan.stripeProductId);
                console.log('✅ Stripe product deleted');
            } catch (stripeError) {
                console.error('⚠️  Stripe deletion failed:', stripeError.message);
            }
        }

        await plan.destroy();

        res.json({ message: 'Plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get all subscription plans
 */
exports.getAllPlans = async (req, res) => {
    try {
        const plans = await db.SubscriptionPlan.findAll({
            where: { isActive: true },
            order: [['sortOrder', 'ASC'], ['price', 'ASC']]
        });

        res.json({
            plans: plans.map(plan => ({
                id: plan.id,
                name: plan.name,
                type: plan.type,
                billingCycle: plan.billingCycle,
                price: plan.price,
                currency: plan.currency,
                description: plan.description,
                features: plan.features,
                limits: plan.limits,
                trialDays: plan.trialDays,
                popular: plan.popular,
                stripeProductId: plan.stripeProductId,
                stripePriceId: plan.stripePriceId,
                isActive: plan.isActive,
                createdAt: plan.createdAt,
                updatedAt: plan.updatedAt
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Manually create trial for user
 */
exports.createTrialForUser = async (req, res) => {
    try {
        const { userId, planId, trialDays, trialType } = req.body;

        // Check if user exists
        const user = await db.UserLogin.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if user already has active trial
        const existingTrial = await db.Trial.getActiveTrial(userId);
        if (existingTrial) {
            return res.status(400).json({ 
                error: 'User already has an active trial',
                trial: existingTrial
            });
        }

        // Check if user has active subscription
        const existingSubscription = await db.Subscription.findOne({
            where: { userId, status: 'active' }
        });

        if (existingSubscription) {
            return res.status(400).json({ 
                error: 'User already has an active subscription',
                subscription: existingSubscription
            });
        }

        // Get plan details
        const plan = await db.SubscriptionPlan.findByPk(planId);
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        // Create trial
        const trial = await db.Trial.create({
            userId,
            trialType: trialType || 'admin_created',
            duration: trialDays || plan.trialDays || 15,
            features: plan.features,
            status: 'active'
        });

        res.status(201).json({
            message: 'Trial created successfully',
            trial
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Cancel user subscription
 */
exports.cancelUserSubscription = async (req, res) => {
    try {
        const { userId, reason } = req.body;

        const subscription = await db.Subscription.findOne({
            where: { userId, status: 'active' }
        });

        if (!subscription) {
            return res.status(404).json({ error: 'No active subscription found' });
        }

        // Cancel in Stripe
        const stripeSubscription = await stripeService.cancelSubscription(userId);

        // Update trial if exists
        const trial = await db.Trial.getActiveTrial(userId);
        if (trial) {
            await trial.update({ 
                status: 'cancelled',
                cancellationDate: new Date()
            });
        }

        res.json({
            message: 'Subscription cancelled successfully',
            subscription: stripeSubscription
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get user subscription details
 */
exports.getUserSubscription = async (req, res) => {
    try {
        const { userId } = req.params;

        const subscription = await db.Subscription.findOne({
            where: { userId },
            include: [
                {
                    model: db.SubscriptionPlan,
                    as: 'plan'
                },
                {
                    model: db.UserLogin,
                    as: 'user',
                    attributes: ['Email', 'FirstName', 'LastName']
                },
                {
                    model: db.Trial,
                    as: 'trial',
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        if (!subscription) {
            return res.status(404).json({ error: 'No subscription found' });
        }

        const stripeStatus = await stripeService.getSubscriptionStatus(userId);

        res.json({
            subscription,
            stripeStatus,
            trialDaysRemaining: subscription.trial ? 
                Math.ceil((new Date(subscription.trial.endDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
