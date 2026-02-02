const db = require('./models');

async function fixForeignKeys() {
    try {
        console.log('🔧 Fixing foreign key constraints...');
        
        // Make foreign keys nullable
        await db.sequelize.query(`
            ALTER TABLE owner 
            MODIFY COLUMN OProperty_id INT NULL
        `);
        
        await db.sequelize.query(`
            ALTER TABLE loan 
            MODIFY COLUMN property_id INT NULL
        `);
        
        console.log('✅ Foreign keys fixed successfully!');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Fix failed:', error.message);
        process.exit(1);
    }
}

fixForeignKeys();
