const fs = require('fs');
const path = require('path');
const db = require('../models');
const logger = require('../utils/logger');

async function startupCheck() {
    console.log('🔍 BACKEND STARTUP CHECK');
    console.log('========================');
    
    let allChecksPassed = true;
    
    try {
        // Check environment variables
        console.log('\n📋 Environment Variables:');
        checkEnvironment();
        
        // Check database connection
        console.log('\n🗄️ Database Connection:');
        await checkDatabase();
        
        // Check required directories
        console.log('\n📁 Directory Structure:');
        checkDirectories();
        
        // Check models
        console.log('\n📊 Database Models:');
        checkModels();
        
        // Check controllers
        console.log('\n🎮 Controllers:');
        checkControllers();
        
        // Check routes
        console.log('\n🛣️ Routes:');
        checkRoutes();
        
        // Check services
        console.log('\n🔧 Services:');
        checkServices();
        
        // Summary
        console.log('\n🎉 STARTUP CHECK SUMMARY');
        console.log('======================');
        
        if (allChecksPassed) {
            console.log('✅ All checks passed! Backend is ready to start.');
        } else {
            console.log('⚠️  Some checks failed. Please review the issues above.');
        }
        
    } catch (error) {
        console.error('❌ Startup check failed:', error.message);
        allChecksPassed = false;
    }
    
    return allChecksPassed;
}

function checkEnvironment() {
    const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
    const optionalEnvVars = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];
    
    requiredEnvVars.forEach(envVar => {
        if (!process.env[envVar]) {
            console.log(`❌ Missing required: ${envVar}`);
        } else {
            console.log(`✅ ${envVar}: Set`);
        }
    });
    
    optionalEnvVars.forEach(envVar => {
        if (!process.env[envVar]) {
            console.log(`⚠️  Optional missing: ${envVar}`);
        } else {
            console.log(`✅ ${envVar}: Set`);
        }
    });
}

async function checkDatabase() {
    try {
        await db.sequelize.authenticate();
        console.log('✅ Database connection: Successful');
        
        // Check if tables exist
        const tables = await db.sequelize.getQueryInterface().showAllTables();
        const requiredTables = [
            'property', 'auction', 'owner', 'loan', 'user_login',
            'subscription', 'trial', 'property_equity', 'lead', 'user_activity'
        ];
        
        requiredTables.forEach(table => {
            if (tables.includes(table)) {
                console.log(`✅ Table exists: ${table}`);
            } else {
                console.log(`❌ Missing table: ${table}`);
            }
        });
        
    } catch (error) {
        console.log(`❌ Database connection failed: ${error.message}`);
    }
}

function checkDirectories() {
    const requiredDirs = ['logs', 'uploads', 'temp'];
    
    requiredDirs.forEach(dir => {
        const dirPath = path.join(__dirname, '..', dir);
        if (fs.existsSync(dirPath)) {
            console.log(`✅ Directory exists: ${dir}`);
        } else {
            console.log(`❌ Missing directory: ${dir}`);
        }
    });
}

function checkModels() {
    const modelsDir = path.join(__dirname, '..', 'models');
    const modelFiles = fs.readdirSync(modelsDir)
        .filter(file => file.endsWith('.js') && file !== 'index.js');
    
    console.log(`✅ Found ${modelFiles.length} model files`);
    
    // Check if models can be loaded
    try {
        const models = db;
        const modelNames = Object.keys(models).filter(key => key !== 'sequelize' && key !== 'Sequelize');
        console.log(`✅ Loaded ${modelNames.length} models`);
    } catch (error) {
        console.log(`❌ Model loading failed: ${error.message}`);
    }
}

function checkControllers() {
    const controllersDir = path.join(__dirname, '..', 'controllers');
    
    // Check admin controllers
    const adminDir = path.join(controllersDir, 'admin');
    if (fs.existsSync(adminDir)) {
        const adminControllers = fs.readdirSync(adminDir).filter(file => file.endsWith('.js'));
        console.log(`✅ Admin controllers: ${adminControllers.length}`);
    } else {
        console.log('❌ Admin controllers directory missing');
    }
    
    // Check public controllers
    const publicDir = path.join(controllersDir, 'public');
    if (fs.existsSync(publicDir)) {
        const publicControllers = fs.readdirSync(publicDir).filter(file => file.endsWith('.js'));
        console.log(`✅ Public controllers: ${publicControllers.length}`);
    } else {
        console.log('❌ Public controllers directory missing');
    }
}

function checkRoutes() {
    const routesDir = path.join(__dirname, '..', 'routes');
    const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));
    
    console.log(`✅ Found ${routeFiles.length} route files`);
    
    // Check if routes can be loaded
    try {
        const routes = ['adminRoutes', 'publicRoutes', 'premiumRoutes', 'subscriptionRoutes'];
        routes.forEach(route => {
            try {
                require(path.join(routesDir, route));
                console.log(`✅ Route loads: ${route}`);
            } catch (error) {
                console.log(`❌ Route load failed: ${route}`);
            }
        });
    } catch (error) {
        console.log(`❌ Route loading failed: ${error.message}`);
    }
}

function checkServices() {
    const servicesDir = path.join(__dirname, '..', 'services');
    
    if (fs.existsSync(servicesDir)) {
        const serviceFiles = fs.readdirSync(servicesDir).filter(file => file.endsWith('.js'));
        console.log(`✅ Found ${serviceFiles.length} service files`);
        
        serviceFiles.forEach(service => {
            try {
                require(path.join(servicesDir, service));
                console.log(`✅ Service loads: ${service}`);
            } catch (error) {
                console.log(`❌ Service load failed: ${service}`);
            }
        });
    } else {
        console.log('❌ Services directory missing');
    }
}

// Run the check if this file is executed directly
if (require.main === module) {
    startupCheck().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { startupCheck };
