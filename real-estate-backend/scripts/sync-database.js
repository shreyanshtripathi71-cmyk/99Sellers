const db = require('./models');

async function syncDatabase() {
    try {
        console.log('🔄 Syncing database schema...');
        
        // This will update the schema to match the models
        await db.sequelize.sync({ alter: true });
        
        console.log('✅ Database schema synced successfully!');
        console.log('📊 Tables updated to match model definitions');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Database sync failed:', error.message);
        process.exit(1);
    }
}

syncDatabase();
