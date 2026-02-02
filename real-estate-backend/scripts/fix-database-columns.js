const db = require('./models');

async function fixDatabaseColumns() {
    try {
        console.log('🔧 Fixing database columns...');
        
        // Make the foreign key columns nullable
        await db.sequelize.query(`
            ALTER TABLE property 
            MODIFY COLUMN proaddress_id INT NULL,
            MODIFY COLUMN motive_type_id INT NULL,
            MODIFY COLUMN PFilesUrlsId INT NULL
        `);
        
        await db.sequelize.query(`
            ALTER TABLE auction 
            MODIFY COLUMN APropertyID INT NULL
        `);
        
        console.log('✅ Database columns fixed successfully!');
        
        // Now sync the associations
        await db.sequelize.sync({ alter: true });
        
        console.log('✅ Associations synced successfully!');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Database fix failed:', error.message);
        process.exit(1);
    }
}

fixDatabaseColumns();
