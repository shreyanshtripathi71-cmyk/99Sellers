const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');
const db = require('../models');

class StripeService {
  constructor() {
    this.stripe = stripe;
  }

  /**
   * Create a customer in Stripe
   */
  async createCustomer(userId, email, name) {
    try {
      const customer = await this.stripe.customers.create({
        email: email,
        name: name,
        metadata: {
          userId: userId.toString()
        }
      });

      // Update user with Stripe customer ID
      await db.UserLogin.update(
        { stripeCustomerId: customer.id },
        { where: { id: userId } }
      );

      return customer;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  /**
   * Create a 15-day free trial subscription
   */
  async createTrialSubscription(userId, planId, paymentMethodId) {
    try {
      const user = await db.UserLogin.findByPk(userId);
      const plan = await db.SubscriptionPlan.findByPk(planId);

      if (!user || !plan) {
        throw new Error('User or plan not found');
      }

      // Create or get Stripe customer
      let customer;
      if (user.stripeCustomerId) {
        customer = await this.stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        customer = await this.createCustomer(userId, user.Email, `${user.FirstName} ${user.LastName}`);
      }

      // Attach payment method to customer
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id
      });

      // Set as default payment method
      await this.stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });

      // Create trial subscription
      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: plan.stripePriceId
        }],
        trial_period_days: 15,
        payment_behavior: 'default_incomplete',
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId: userId.toString(),
          planId: planId.toString()
        }
      });

      // Create trial record in database
      const trial = await db.Trial.create({
        userId,
        trialType: 'free_trial',
        duration: 15,
        stripeTrialId: subscription.id,
        features: plan.features,
        status: 'active'
      });

      // Create subscription record
      await db.Subscription.create({
        userId,
        planId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customer.id,
        planType: plan.type,
        status: 'trialing',
        startDate: new Date(),
        endDate: new Date(subscription.trial_end * 1000),
        features: plan.features,
        price: plan.price,
        billingCycle: plan.billingCycle
      });

      return {
        subscription,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        trial
      };
    } catch (error) {
      console.error('Error creating trial subscription:', error);
      throw new Error('Failed to create trial subscription');
    }
  }

  /**
   * Create a regular subscription (after trial)
   */
  async createSubscription(userId, planId, paymentMethodId) {
    try {
      const user = await db.UserLogin.findByPk(userId);
      const plan = await db.SubscriptionPlan.findByPk(planId);

      if (!user || !plan) {
        throw new Error('User or plan not found');
      }

      // Get or create Stripe customer
      let customer;
      if (user.stripeCustomerId) {
        customer = await this.stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        customer = await this.createCustomer(userId, user.Email, `${user.FirstName} ${user.LastName}`);
      }

      // Attach payment method
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id
      });

      // Set as default payment method
      await this.stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });

      // Create subscription
      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: plan.stripePriceId
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId: userId.toString(),
          planId: planId.toString()
        }
      });

      // Update subscription in database
      await db.Subscription.create({
        userId,
        planId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customer.id,
        planType: plan.type,
        status: 'incomplete',
        startDate: new Date(),
        features: plan.features,
        price: plan.price,
        billingCycle: plan.billingCycle
      });

      return {
        subscription,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId) {
    try {
      const subscription = await db.Subscription.findOne({
        where: { userId, status: 'active' }
      });

      if (!subscription) {
        throw new Error('No active subscription found');
      }

      // Cancel in Stripe
      const stripeSubscription = await this.stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        { cancel_at_period_end: true }
      );

      // Update in database
      await subscription.update({
        status: 'cancelled',
        endDate: new Date(stripeSubscription.cancel_at * 1000)
      });

      // Update trial if exists
      const trial = await db.Trial.getActiveTrial(userId);
      if (trial) {
        await trial.update({ status: 'cancelled' });
      }

      return stripeSubscription;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Update subscription
   */
  async updateSubscription(userId, newPlanId) {
    try {
      const subscription = await db.Subscription.findOne({
        where: { userId, status: 'active' }
      });

      const newPlan = await db.SubscriptionPlan.findByPk(newPlanId);

      if (!subscription || !newPlan) {
        throw new Error('Subscription or plan not found');
      }

      // Update in Stripe
      const stripeSubscription = await this.stripe.subscriptions.retrieve(
        subscription.stripeSubscriptionId
      );

      const updatedSubscription = await this.stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        {
          items: [{
            id: stripeSubscription.items.data[0].id,
            price: newPlan.stripePriceId
          }],
          proration_behavior: 'create_prorations'
        }
      );

      // Update in database
      await subscription.update({
        planId: newPlanId,
        planType: newPlan.type,
        price: newPlan.price,
        billingCycle: newPlan.billingCycle,
        features: newPlan.features
      });

      return updatedSubscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }

  /**
   * Get subscription status
   */
  async getSubscriptionStatus(userId) {
    try {
      const subscription = await db.Subscription.findOne({
        where: { userId },
        include: [{
          model: db.SubscriptionPlan,
          as: 'plan'
        }]
      });

      if (!subscription) {
        return { status: 'none' };
      }

      // Get Stripe subscription
      const stripeSubscription = await this.stripe.subscriptions.retrieve(
        subscription.stripeSubscriptionId
      );

      return {
        status: subscription.status,
        plan: subscription.plan,
        stripeStatus: stripeSubscription.status,
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end
      };
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return { status: 'error' };
    }
  }

  /**
   * Create payment intent for one-time payment
   */
  async createPaymentIntent(userId, amount, currency = 'usd') {
    try {
      const user = await db.UserLogin.findByPk(userId);
      
      let customer;
      if (user.stripeCustomerId) {
        customer = await this.stripe.customers.retrieve(user.stripeCustomerId);
      } else {
        customer = await this.createCustomer(userId, user.Email, `${user.FirstName} ${user.LastName}`);
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: currency,
        customer: customer.id,
        metadata: {
          userId: userId.toString()
        }
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Handle webhook events from Stripe
   */
  async handleWebhook(event) {
    switch (event.type) {
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.upcoming':
        await this.handleUpcomingInvoice(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  async handlePaymentSucceeded(invoice) {
    try {
      const subscription = await db.Subscription.findOne({
        where: { stripeSubscriptionId: invoice.subscription }
      });

      if (subscription) {
        await subscription.update({
          status: 'active',
          lastPaymentDate: new Date()
        });

        // Update trial if exists
        const trial = await db.Trial.findOne({
          where: { userId: subscription.userId, stripeTrialId: invoice.subscription }
        });

        if (trial && trial.status === 'active') {
          await trial.update({
            status: 'converted',
            convertedToPlan: subscription.planType
          });
        }
      }
    } catch (error) {
      console.error('Error handling payment succeeded:', error);
    }
  }

  async handlePaymentFailed(invoice) {
    try {
      const subscription = await db.Subscription.findOne({
        where: { stripeSubscriptionId: invoice.subscription }
      });

      if (subscription) {
        await subscription.update({
          status: 'past_due'
        });
      }
    } catch (error) {
      console.error('Error handling payment failed:', error);
    }
  }

  async handleSubscriptionDeleted(stripeSubscription) {
    try {
      const subscription = await db.Subscription.findOne({
        where: { stripeSubscriptionId: stripeSubscription.id }
      });

      if (subscription) {
        await subscription.update({
          status: 'cancelled',
          endDate: new Date()
        });
      }
    } catch (error) {
      console.error('Error handling subscription deleted:', error);
    }
  }

  async handleUpcomingInvoice(invoice) {
    try {
      // Send notification about upcoming payment
      const subscription = await db.Subscription.findOne({
        where: { stripeSubscriptionId: invoice.subscription },
        include: [{
          model: db.UserLogin,
          as: 'user',
          attributes: ['Email', 'FirstName', 'LastName']
        }]
      });

      if (subscription && subscription.user) {
        console.log(`Upcoming invoice for ${subscription.user.Email}: $${invoice.amount_paid / 100}`);
        // TODO: Send email notification
      }
    } catch (error) {
      console.error('Error handling upcoming invoice:', error);
    }
  }
}

module.exports = new StripeService();
