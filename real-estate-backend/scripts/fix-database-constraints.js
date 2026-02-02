const db = require('./models');

async function fixDatabaseConstraints() {
    try {
        console.log('🔧 Fixing database constraints...');
        
        // Drop existing foreign key constraints (MySQL compatible)
        try {
            await db.sequelize.query(`ALTER TABLE owner DROP FOREIGN KEY owner_ibfk_1`);
        } catch (e) {
            // Ignore if constraint doesn't exist
        }
        
        try {
            await db.sequelize.query(`ALTER TABLE loan DROP FOREIGN KEY loan_ibfk_1`);
        } catch (e) {
            // Ignore if constraint doesn't exist
        }
        
        try {
            await db.sequelize.query(`ALTER TABLE auction DROP FOREIGN KEY auction_ibfk_1`);
        } catch (e) {
            // Ignore if constraint doesn't exist
        }
        
        // Add back foreign key constraints with proper cascade settings
        await db.sequelize.query(`ALTER TABLE owner ADD CONSTRAINT owner_ibfk_1 FOREIGN KEY (OProperty_id) REFERENCES property (id) ON DELETE SET NULL ON UPDATE CASCADE`);
        await db.sequelize.query(`ALTER TABLE loan ADD CONSTRAINT loan_ibfk_1 FOREIGN KEY (property_id) REFERENCES property (id) ON DELETE SET NULL ON UPDATE CASCADE`);
        await db.sequelize.query(`ALTER TABLE auction ADD CONSTRAINT auction_ibfk_1 FOREIGN KEY (APropertyID) REFERENCES property (id) ON DELETE SET NULL ON UPDATE CASCADE`);
        
        console.log('✅ Database constraints fixed successfully!');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Fix failed:', error.message);
        process.exit(1);
    }
}

fixDatabaseConstraints();
