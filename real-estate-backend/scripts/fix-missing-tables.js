const db = require('../models');

async function fixMissingTables() {
    try {
        console.log('🔧 Fixing missing database tables...');
        
        // Create trial table if it doesn't exist
        const queryInterface = db.sequelize.getQueryInterface();
        
        // Check if trial table exists
        const tables = await queryInterface.showAllTables();
        
        if (!tables.includes('trial')) {
            console.log('Creating trial table...');
            await queryInterface.createTable('trial', {
                id: {
                    type: db.Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false
                },
                userId: {
                    type: db.Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'user_login',
                        key: 'id'
                    }
                },
                trialType: {
                    type: db.Sequelize.ENUM('free_trial', 'promotional', 'extended'),
                    allowNull: false,
                    defaultValue: 'free_trial'
                },
                startDate: {
                    type: db.Sequelize.DATE,
                    allowNull: false,
                    defaultValue: db.Sequelize.NOW
                },
                endDate: {
                    type: db.Sequelize.DATE,
                    allowNull: false
                },
                duration: {
                    type: db.Sequelize.INTEGER,
                    allowNull: false,
                    defaultValue: 15
                },
                status: {
                    type: db.Sequelize.ENUM('active', 'expired', 'converted', 'cancelled'),
                    allowNull: false,
                    defaultValue: 'active'
                },
                features: {
                    type: db.Sequelize.JSON,
                    allowNull: true,
                    defaultValue: {}
                },
                usageStats: {
                    type: db.Sequelize.JSON,
                    allowNull: true,
                    defaultValue: {}
                },
                conversionDate: {
                    type: db.Sequelize.DATE,
                    allowNull: true
                },
                cancellationDate: {
                    type: db.Sequelize.DATE,
                    allowNull: true
                },
                reminderSent: {
                    type: db.Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                stripeTrialId: {
                    type: db.Sequelize.STRING,
                    allowNull: true
                },
                convertedToPlan: {
                    type: db.Sequelize.STRING,
                    allowNull: true
                },
                createdAt: {
                    type: db.Sequelize.DATE,
                    allowNull: false,
                    defaultValue: db.Sequelize.NOW
                },
                updatedAt: {
                    type: db.Sequelize.DATE,
                    allowNull: false,
                    defaultValue: db.Sequelize.NOW
                }
            });
            
            console.log('✅ Trial table created successfully');
        } else {
            console.log('✅ Trial table already exists');
        }
        
        // Sync models to ensure all associations are set up
        console.log('Syncing models...');
        await db.sequelize.sync({ alter: true });
        console.log('✅ Models synced successfully');
        
        console.log('🎉 Missing tables fixed successfully!');
        
    } catch (error) {
        console.error('❌ Fix failed:', error.message);
        process.exit(1);
    }
}

fixMissingTables();
