# 💳 Complete Subscription System Guide

## 🎯 **Overview**

Your B2B SaaS Real Estate Platform now includes a **complete subscription system** with 15-day free trials and Stripe payment integration. This system allows you to monetize your platform while providing value to users at different tiers.

---

## 🏗️ **System Architecture**

### **📊 Subscription Tiers**
```
🆓 Free Trial (15 days)
├── Limited property search
├── Basic auction information
├── Lead hints
└── No export capabilities

💎 Basic Plan ($29/month or $290/year)
├── 50 property views/day
├── Basic search filters
├── Monthly data export (100 records)
├── Email support
└── 15-day trial included

🚀 Premium Plan ($99/month or $990/year)
├── Unlimited property searches
├── Complete property and equity data
├── Advanced lead generation
├── Real-time auction alerts
├── Unlimited data exports
├── Priority customer support
├── Analytics dashboard
└── 15-day trial included

🏢 Enterprise Plan ($499/month or $4,990/year)
├── Everything in Premium
├── White-label branding
├── Custom integrations
├── Dedicated account manager
├── Custom reporting
├── Unlimited API access
├── Bulk data processing
├── SLA guarantee
└── 30-day trial included
```

---

## 🔧 **Technical Implementation**

### **📁 New Models Created**

#### **1. Trial Model**
```javascript
{
  userId: INTEGER,           // User ID
  trialType: ENUM,          // free_trial, promotional, extended
  startDate: DATE,          // Trial start date
  endDate: DATE,            // Trial end date
  duration: INTEGER,         // Trial duration in days
  status: ENUM,             // active, expired, converted, cancelled
  features: JSON,           // Available features during trial
  usageStats: JSON,         // Usage tracking
  stripeTrialId: STRING     // Stripe trial subscription ID
}
```

#### **2. SubscriptionPlan Model**
```javascript
{
  name: STRING,             // Plan name
  stripePriceId: STRING,    // Stripe price ID
  stripeProductId: STRING,  // Stripe product ID
  type: ENUM,               // basic, premium, enterprise
  billingCycle: ENUM,       // monthly, yearly
  price: DECIMAL,           // Price in cents
  features: JSON,           // Plan features
  limits: JSON,             // Usage limits
  trialDays: INTEGER,        // Trial days for this plan
  popular: BOOLEAN,         // Highlight as popular
}
```

#### **3. Enhanced Subscription Model**
```javascript
{
  userId: INTEGER,           // User ID
  planId: INTEGER,           // Plan ID
  stripeSubscriptionId: STRING, // Stripe subscription ID
  stripeCustomerId: STRING,   // Stripe customer ID
  planType: ENUM,             // Plan type
  status: ENUM,               // active, cancelled, expired, trialing
  features: JSON,           // Available features
  price: DECIMAL,            // Price
  billingCycle: ENUM,        // Billing cycle
}
```

---

## 💳 **Stripe Integration**

### **🔑 Required Environment Variables**
```bash
# Add to your .env file
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### **🏪 Stripe Products & Prices**
The system automatically creates:
- **3 Product Types**: Basic, Premium, Enterprise
- **6 Price Points**: Monthly and yearly for each type
- **Free Trial Support**: 15-30 days depending on plan
- **Automatic Discounts**: 17-20% for yearly billing

### **🔗 Webhook Events**
- `invoice.payment_succeeded` - Payment successful
- `invoice.payment_failed` - Payment failed
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.upcoming` - Upcoming payment notification

---

## 🚀 **API Endpoints**

### **📋 Subscription Management**
```javascript
// Get available plans
GET /api/subscription/plans

// Get current subscription status
GET /api/subscription/status

// Start 15-day free trial
POST /api/subscription/trial/start
{
  planId: 1,
  paymentMethodId: "pm_xxx"
}

// Create regular subscription
POST /api/subscription/create
{
  planId: 1,
  paymentMethodId: "pm_xxx"
}

// Cancel subscription
POST /api/subscription/cancel

// Update subscription
PUT /api/subscription/update
{
  newPlanId: 2
}
```

### **💳 Payment Methods**
```javascript
// Get saved payment methods
GET /api/subscription/payment-methods

// Add payment method
POST /api/subscription/payment-methods
{
  paymentMethodId: "pm_xxx"
}

// Set default payment method
PUT /api/subscription/payment-methods/default
{
  paymentMethodId: "pm_xxx"
}
```

### **📊 Trial Management**
```javascript
// Get trial usage statistics
GET /api/subscription/trial/usage

// Trial features automatically applied based on plan
```

---

## 🔄 **User Journey Flow**

### **🆓 New User Registration**
1. User registers for free account
2. User gets limited access (masked data)
3. System prompts for trial upgrade

### **🚀 Trial Activation**
1. User selects a plan (Basic/Premium/Enterprise)
2. User adds payment method
3. System creates 15-day trial subscription
4. User gets full premium features immediately
5. Payment collected after trial ends

### **💰 Payment Processing**
1. Trial ends (15 days)
2. Stripe automatically charges payment method
3. Subscription becomes active
4. User continues with premium features
5. If payment fails, subscription becomes past_due

### **❌ Cancellation Flow**
1. User cancels subscription
2. Access downgrades to free tier
3. Data masking applied again
4. Can reactivate anytime

---

## 🛠️ **Security & Compliance**

### **🔒 Security Features**
- **Stripe Security**: All payment processing handled by Stripe
- **Webhook Verification**: All webhooks verified with signature
- **Data Privacy**: Automatic data masking for free users
- **Access Control**: Premium features require active subscription

### **📊 Usage Tracking**
- **Trial Limits**: Monitor usage during trial period
- **API Quotas**: Enforce plan-based limits
- **Feature Access**: Control features based on subscription
- **Activity Logging**: Track all user activities

### **⚖️ Error Handling**
- **Payment Failures**: Graceful downgrade to free tier
- **Subscription Issues**: Clear error messages
- **Trial Expiration**: Automatic notifications
- **Webhook Failures**: Retry mechanisms

---

## 📈 **Business Metrics**

### **📊 Key Metrics to Track**
- **Trial Conversion Rate**: % of trials converting to paid
- **Churn Rate**: % of users cancelling subscriptions
- **Average Revenue Per User (ARPU)**
- **Customer Lifetime Value (CLV)**
- **Trial Usage Patterns**: Most popular features during trial

### **💰 Revenue Optimization**
- **Yearly Discounts**: 17-20% discounts for annual billing
- **Trial Length**: 15-30 days to maximize conversion
- **Plan Upgrades**: Easy upgrade paths between tiers
- **Retention Features**: Value-added services

---

## 🛠️ **Setup Instructions**

### **1. Install Dependencies**
```bash
npm install stripe
```

### **2. Configure Environment**
```bash
# Copy environment template
cp .env.example .env

# Add your Stripe keys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### **3. Setup Stripe Products**
```bash
# Run the setup script
node utils/setup-stripe-products.js
```

### **4. Configure Webhooks**
- Log into Stripe Dashboard
- Go to Developers → Webhooks
- Add endpoint: `https://yourdomain.com/webhooks/stripe`
- Select events: `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`, `invoice.upcoming`
- Add webhook secret to environment

### **5. Test the System**
```bash
# Test subscription system
node utils/test-subscription-system.js
```

---

## 🎯 **Frontend Integration**

### **💳 Stripe Elements Integration**
```javascript
// Example: React with Stripe Elements
import { loadStripe } from '@stripe/stripe-js';

const stripe = loadStripe('pk_test_your_publishable_key');

const elements = stripe.elements();
const cardElement = elements.create('card');

cardElement.mount('#card-element');
```

### **📋 Plan Selection UI**
```javascript
// Display plans with pricing
const plans = await fetch('/api/subscription/plans');
// Show monthly/yearly toggle
// Highlight popular plan
// Show trial benefits
```

### **🚀 Trial Start Flow**
```javascript
// Start trial with payment method
const trialResponse = await fetch('/api/subscription/trial/start', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    planId: selectedPlan.id,
    paymentMethodId: paymentMethodId
  })
});
```

### **📊 Subscription Status**
```javascript
// Check subscription status
const status = await fetch('/api/subscription/status', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Show trial days remaining
// Display current plan
// Show payment status
```

---

## 🔧 **Customization Options**

### **📝 Plan Customization**
- Modify features in `setup-stripe-products.js`
- Adjust pricing and billing cycles
- Change trial durations
- Add custom features per plan

### **🎨 Branding Options**
- Customize product names and descriptions
- Add your own product images
- Set custom pricing tiers
- Configure trial periods

### **⚙️ Business Rules**
- Modify trial conversion logic
- Add custom grace periods
- Implement promotional pricing
- Set custom usage limits

---

## 🚀 **Production Deployment**

### **🔧 Environment Setup**
```bash
# Production environment variables
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
```

### **🔒 Security Considerations**
- Use HTTPS for all API endpoints
- Validate all webhook signatures
- Implement rate limiting
- Monitor for suspicious activity
- Regular security updates

### **📊 Monitoring & Analytics**
- Track subscription metrics
- Monitor payment failures
- Analyze trial conversion rates
- Set up revenue reporting

---

## 🎉 **Summary**

Your subscription system is now **complete and production-ready** with:

✅ **15-Day Free Trials** - Convert users to paid customers  
✅ **Multiple Pricing Tiers** - Basic, Premium, Enterprise  
✅ **Stripe Integration** - Secure payment processing  
✅ **Automatic Billing** - Seamless payment collection  
✅ **Usage Tracking** - Monitor and enforce limits  
✅ **Webhook Handling** - Real-time payment events  
✅ **Data Masking** - Protect premium features  
✅ **Graceful Downgrades** - Handle payment failures  
✅ **Easy Upgrades** - Smooth plan transitions  

**Your B2B SaaS Real Estate Platform is now ready to generate revenue through subscriptions while providing exceptional value to your users!** 🚀
