const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../models');

async function setupStripeProducts() {
    console.log('🏪 Setting up Stripe Products and Prices');
    console.log('====================================');
    
    try {
        // Create Basic Plan Product
        const basicProduct = await stripe.products.create({
            name: 'Basic Plan',
            description: 'Essential features for real estate professionals',
            images: [],
            metadata: {
                plan_type: 'basic',
                features: JSON.stringify([
                    'Property search with basic filters',
                    'Up to 50 property views per day',
                    'Basic auction information',
                    'Monthly data export (100 records)',
                    'Email support'
                ])
            }
        });
        
        // Create Basic Plan Prices
        const basicMonthlyPrice = await stripe.prices.create({
            product: basicProduct.id,
            unit_amount: 2900, // $29.00
            currency: 'usd',
            recurring: {
                interval: 'month',
                interval_count: 1
            },
            metadata: {
                plan_type: 'basic',
                billing_cycle: 'monthly'
            }
        });
        
        const basicYearlyPrice = await stripe.prices.create({
            product: basicProduct.id,
            unit_amount: 29000, // $290.00 (20% discount)
            currency: 'usd',
            recurring: {
                interval: 'year',
                interval_count: 1
            },
            metadata: {
                plan_type: 'basic',
                billing_cycle: 'yearly'
            }
        });
        
        console.log('✅ Basic Plan created');
        console.log('   Product ID:', basicProduct.id);
        console.log('   Monthly Price ID:', basicMonthlyPrice.id);
        console.log('   Yearly Price ID:', basicYearlyPrice.id);
        
        // Create Premium Plan Product
        const premiumProduct = await stripe.products.create({
            name: 'Premium Plan',
            description: 'Advanced features for serious real estate investors',
            images: [],
            metadata: {
                plan_type: 'premium',
                features: JSON.stringify([
                    'Unlimited property searches',
                    'Complete property and equity data',
                    'Advanced lead generation',
                    'Real-time auction alerts',
                    'Unlimited data exports',
                    'Priority customer support',
                    'Advanced analytics dashboard',
                    'API access (1000 calls/day)'
                ])
            }
        });
        
        // Create Premium Plan Prices
        const premiumMonthlyPrice = await stripe.prices.create({
            product: premiumProduct.id,
            unit_amount: 9900, // $99.00
            currency: 'usd',
            recurring: {
                interval: 'month',
                interval_count: 1
            },
            metadata: {
                plan_type: 'premium',
                billing_cycle: 'monthly'
            }
        });
        
        const premiumYearlyPrice = await stripe.prices.create({
            product: premiumProduct.id,
            unit_amount: 99000, // $990.00 (17% discount)
            currency: 'usd',
            recurring: {
                interval: 'year',
                interval_count: 1
            },
            metadata: {
                plan_type: 'premium',
                billing_cycle: 'yearly'
            }
        });
        
        console.log('✅ Premium Plan created');
        console.log('   Product ID:', premiumProduct.id);
        console.log('   Monthly Price ID:', premiumMonthlyPrice.id);
        console.log('   Yearly Price ID:', premiumYearlyPrice.id);
        
        // Create Enterprise Plan Product
        const enterpriseProduct = await stripe.products.create({
            name: 'Enterprise Plan',
            description: 'Complete solution for large real estate organizations',
            images: [],
            metadata: {
                plan_type: 'enterprise',
                features: JSON.stringify([
                    'Everything in Premium',
                    'White-label branding options',
                    'Custom integrations',
                    'Dedicated account manager',
                    'Custom reporting',
                    'Unlimited API access',
                    'Bulk data processing',
                    'Priority feature requests',
                    'SLA guarantee'
                ])
            }
        });
        
        // Create Enterprise Plan Prices
        const enterpriseMonthlyPrice = await stripe.prices.create({
            product: enterpriseProduct.id,
            unit_amount: 49900, // $499.00
            currency: 'usd',
            recurring: {
                interval: 'month',
                interval_count: 1
            },
            metadata: {
                plan_type: 'enterprise',
                billing_cycle: 'monthly'
            }
        });
        
        const enterpriseYearlyPrice = await stripe.prices.create({
            product: enterpriseProduct.id,
            unit_amount: 499000, // $4,990.00 (17% discount)
            currency: 'usd',
            recurring: {
                interval: 'year',
                interval_count: 1
            },
            metadata: {
                plan_type: 'enterprise',
                billing_cycle: 'yearly'
            }
        });
        
        console.log('✅ Enterprise Plan created');
        console.log('   Product ID:', enterpriseProduct.id);
        console.log('   Monthly Price ID:', enterpriseMonthlyPrice.id);
        console.log('   Yearly Price ID:', enterpriseYearlyPrice.id);
        
        // Save plans to database
        const plans = [
            {
                name: 'Basic Plan',
                type: 'basic',
                stripeProductId: basicProduct.id,
                stripePriceId: basicMonthlyPrice.id,
                billingCycle: 'monthly',
                price: 29.00,
                currency: 'USD',
                description: 'Essential features for real estate professionals',
                features: {
                    searchLimit: 50,
                    exportLimit: 100,
                    apiCallsPerDay: 100,
                    propertiesPerSearch: 20,
                    leadsPerMonth: 50,
                    storageMB: 100,
                    advancedSearch: false,
                    fullDataAccess: false,
                    exportEnabled: true,
                    leadGeneration: false,
                    realTimeAlerts: false
                },
                limits: {
                    searchLimit: 50,
                    exportLimit: 100,
                    apiCallsPerDay: 100,
                    propertiesPerSearch: 20,
                    leadsPerMonth: 50,
                    storageMB: 100
                },
                trialDays: 15,
                popular: false,
                sortOrder: 1
            },
            {
                name: 'Basic Plan (Yearly)',
                type: 'basic',
                stripeProductId: basicProduct.id,
                stripePriceId: basicYearlyPrice.id,
                billingCycle: 'yearly',
                price: 290.00,
                currency: 'USD',
                description: 'Essential features for real estate professionals (Yearly)',
                features: {
                    searchLimit: 50,
                    exportLimit: 100,
                    apiCallsPerDay: 100,
                    propertiesPerSearch: 20,
                    leadsPerMonth: 50,
                    storageMB: 100,
                    advancedSearch: false,
                    fullDataAccess: false,
                    exportEnabled: true,
                    leadGeneration: false,
                    realTimeAlerts: false
                },
                limits: {
                    searchLimit: 50,
                    exportLimit: 100,
                    apiCallsPerDay: 100,
                    propertiesPerSearch: 20,
                    leadsPerMonth: 50,
                    storageMB: 100
                },
                trialDays: 15,
                popular: false,
                sortOrder: 2
            },
            {
                name: 'Premium Plan',
                type: 'premium',
                stripeProductId: premiumProduct.id,
                stripePriceId: premiumMonthlyPrice.id,
                billingCycle: 'monthly',
                price: 99.00,
                currency: 'USD',
                description: 'Advanced features for serious real estate investors',
                features: {
                    searchLimit: 1000,
                    exportLimit: 1000,
                    apiCallsPerDay: 1000,
                    propertiesPerSearch: 100,
                    leadsPerMonth: 500,
                    storageMB: 1000,
                    advancedSearch: true,
                    fullDataAccess: true,
                    exportEnabled: true,
                    leadGeneration: true,
                    realTimeAlerts: true
                },
                limits: {
                    searchLimit: 1000,
                    exportLimit: 1000,
                    apiCallsPerDay: 1000,
                    propertiesPerSearch: 100,
                    leadsPerMonth: 500,
                    storageMB: 1000
                },
                trialDays: 15,
                popular: true,
                sortOrder: 3
            },
            {
                name: 'Premium Plan (Yearly)',
                type: 'premium',
                stripeProductId: premiumProduct.id,
                stripePriceId: premiumYearlyPrice.id,
                billingCycle: 'yearly',
                price: 990.00,
                currency: 'USD',
                description: 'Advanced features for serious real estate investors (Yearly)',
                features: {
                    searchLimit: 1000,
                    exportLimit: 1000,
                    apiCallsPerDay: 1000,
                    propertiesPerSearch: 100,
                    leadsPerMonth: 500,
                    storageMB: 1000,
                    advancedSearch: true,
                    fullDataAccess: true,
                    exportEnabled: true,
                    leadGeneration: true,
                    realTimeAlerts: true
                },
                limits: {
                    searchLimit: 1000,
                    exportLimit: 1000,
                    apiCallsPerDay: 1000,
                    propertiesPerSearch: 100,
                    leadsPerMonth: 500,
                    storageMB: 1000
                },
                trialDays: 15,
                popular: false,
                sortOrder: 4
            },
            {
                name: 'Enterprise Plan',
                type: 'enterprise',
                stripeProductId: enterpriseProduct.id,
                stripePriceId: enterpriseMonthlyPrice.id,
                billingCycle: 'monthly',
                price: 499.00,
                currency: 'USD',
                description: 'Complete solution for large real estate organizations',
                features: {
                    searchLimit: 10000,
                    exportLimit: 10000,
                    apiCallsPerDay: 10000,
                    propertiesPerSearch: 1000,
                    leadsPerMonth: 5000,
                    storageMB: 10000,
                    advancedSearch: true,
                    fullDataAccess: true,
                    exportEnabled: true,
                    leadGeneration: true,
                    realTimeAlerts: true,
                    whiteLabel: true,
                    customIntegrations: true,
                    prioritySupport: true,
                    customReporting: true
                },
                limits: {
                    searchLimit: 10000,
                    exportLimit: 10000,
                    apiCallsPerDay: 10000,
                    propertiesPerSearch: 1000,
                    leadsPerMonth: 5000,
                    storageMB: 10000
                },
                trialDays: 30,
                popular: false,
                sortOrder: 5
            },
            {
                name: 'Enterprise Plan (Yearly)',
                type: 'enterprise',
                stripeProductId: enterpriseProduct.id,
                stripePriceId: enterpriseYearlyPrice.id,
                billingCycle: 'yearly',
                price: 4990.00,
                currency: 'USD',
                description: 'Complete solution for large real estate organizations (Yearly)',
                features: {
                    searchLimit: 10000,
                    exportLimit: 10000,
                    apiCallsPerDay: 10000,
                    propertiesPerSearch: 1000,
                    leadsPerMonth: 5000,
                    storageMB: 10000,
                    advancedSearch: true,
                    fullDataAccess: true,
                    exportEnabled: true,
                    leadGeneration: true,
                    realTimeAlerts: true,
                    whiteLabel: true,
                    customIntegrations: true,
                    prioritySupport: true,
                    customReporting: true
                },
                limits: {
                    searchLimit: 10000,
                    exportLimit: 10000,
                    apiCallsPerDay: 10000,
                    propertiesPerSearch: 1000,
                    leadsPerMonth: 5000,
                    storageMB: 10000
                },
                trialDays: 30,
                popular: false,
                sortOrder: 6
            }
        ];
        
        // Save all plans to database
        for (const plan of plans) {
            await db.SubscriptionPlan.create(plan);
        }
        
        console.log('\n🎉 STRIPE PRODUCTS SETUP COMPLETE!');
        console.log('================================');
        console.log('✅ Products created in Stripe');
        console.log('✅ Prices created in Stripe');
        console.log('✅ Plans saved to database');
        console.log('✅ 6 plans total (3 types × 2 billing cycles)');
        
        console.log('\n📋 NEXT STEPS:');
        console.log('1. Update your .env file with Stripe keys');
        console.log('2. Test the subscription system');
        console.log('3. Set up webhook endpoints in Stripe dashboard');
        console.log('4. Configure your frontend with Stripe Elements');
        
        console.log('\n💰 PRICING SUMMARY:');
        console.log('• Basic Plan: $29/month or $290/year (20% discount)');
        console.log('• Premium Plan: $99/month or $990/year (17% discount)');
        console.log('• Enterprise Plan: $499/month or $4,990/year (17% discount)');
        console.log('• All plans include 15-30 day free trials');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    }
}

setupStripeProducts();
