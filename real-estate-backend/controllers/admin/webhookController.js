const stripeService = require('../../services/stripeService');
const express = require('express');

const router = express.Router();

// Stripe webhook endpoint
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripeService.stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
    }

    // Handle the event
    await stripeService.handleWebhook(event);

    // Return a 200 response to acknowledge receipt of the event
    res.send({ received: true });
});

module.exports = router;
