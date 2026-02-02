const express = require('express');

const cors = require('cors');

const app = express();



const db= require('./models');



// Middleware

app.use(cors()); // Enable CORS for all routes

app.use(express.json()); // Parse JSON bodies

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies



// Apply data masking to public routes

const { attachUserSubscription, applyDataMasking } = require('./middleware/dataMasking');



//routers

const adminRoutes = require('./routes/adminRoutes');

const publicRoutes = require('./routes/publicRoutes');

const premiumRoutes = require('./routes/premiumRoutes');

const subscriptionRoutes = require('./routes/subscriptionRoutes');

const webhookController = require('./controllers/admin/webhookController');



app.use('/api/admin', adminRoutes); // Protected Admin Dashboard API

app.use('/api', attachUserSubscription, applyDataMasking, publicRoutes); // Public Site API with subscription check and data masking

app.use('/api/premium', premiumRoutes); // Premium features API

app.use('/api/subscription', subscriptionRoutes); // Subscription management API

app.use('/webhooks', webhookController); // Stripe webhooks



// Error handling middleware

app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({ error: 'Something went wrong!' });

});



db.sequelize.sync().then(() => {

    app.listen(3001, () => {

  console.log(`Server is running on port 3001`);

    });

});

  

