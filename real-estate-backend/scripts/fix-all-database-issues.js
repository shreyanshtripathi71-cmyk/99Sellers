const db = require('../models');

async function fixAllDatabaseIssues() {
    try {
        console.log('🔧 Fixing all database issues...');
        
        // Step 1: Drop all foreign key constraints
        console.log('Step 1: Dropping foreign key constraints...');
        
        try {
            await db.sequelize.query('ALTER TABLE owner DROP FOREIGN KEY owner_ibfk_1');
            console.log('✅ Owner foreign key dropped');
        } catch (e) {
            console.log('ℹ️  Owner foreign key not found or already dropped');
        }
        
        try {
            await db.sequelize.query('ALTER TABLE loan DROP FOREIGN KEY loan_ibfk_1');
            console.log('✅ Loan foreign key dropped');
        } catch (e) {
            console.log('ℹ️  Loan foreign key not found or already dropped');
        }
        
        try {
            await db.sequelize.query('ALTER TABLE auction DROP FOREIGN KEY auction_ibfk_1');
            console.log('✅ Auction foreign key dropped');
        } catch (e) {
            console.log('ℹ️  Auction foreign key not found or already dropped');
        }
        
        // Step 2: Make columns nullable
        console.log('Step 2: Making foreign key columns nullable...');
        
        await db.sequelize.query(`
            ALTER TABLE owner 
            MODIFY COLUMN OProperty_id INT NULL
        `);
        console.log('✅ Owner OProperty_id made nullable');
        
        await db.sequelize.query(`
            ALTER TABLE loan 
            MODIFY COLUMN property_id INT NULL
        `);
        console.log('✅ Loan property_id made nullable');
        
        await db.sequelize.query(`
            ALTER TABLE auction 
            MODIFY COLUMN APropertyID INT NULL
        `);
        console.log('✅ Auction APropertyID made nullable');
        
        // Step 3: Add back foreign key constraints with proper settings
        console.log('Step 3: Adding back foreign key constraints...');
        
        await db.sequelize.query(`
            ALTER TABLE owner 
            ADD CONSTRAINT owner_ibfk_1 
            FOREIGN KEY (OProperty_id) REFERENCES property (id) 
            ON DELETE SET NULL ON UPDATE CASCADE
        `);
        console.log('✅ Owner foreign key constraint added');
        
        await db.sequelize.query(`
            ALTER TABLE loan 
            ADD CONSTRAINT loan_ibfk_1 
            FOREIGN KEY (property_id) REFERENCES property (id) 
            ON DELETE SET NULL ON UPDATE CASCADE
        `);
        console.log('✅ Loan foreign key constraint added');
        
        await db.sequelize.query(`
            ALTER TABLE auction 
            ADD CONSTRAINT auction_ibfk_1 
            FOREIGN KEY (APropertyID) REFERENCES property (id) 
            ON DELETE SET NULL ON UPDATE CASCADE
        `);
        console.log('✅ Auction foreign key constraint added');
        
        // Step 4: Sync models to ensure everything is up to date
        console.log('Step 4: Syncing models...');
        await db.sequelize.sync({ alter: true });
        console.log('✅ Models synced');
        
        console.log('🎉 All database issues fixed successfully!');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Fix failed:', error.message);
        process.exit(1);
    }
}

fixAllDatabaseIssues();
