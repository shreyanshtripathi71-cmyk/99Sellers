const db = require('../models');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
    try {
        console.log('👤 Creating admin user...');
        
        // Check if admin already exists
        const existingAdmin = await db.UserLogin.findOne({ where: { Email: 'admin@example.com' } });
        
        if (existingAdmin) {
            // Update existing admin with correct password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password', salt);
            await existingAdmin.update({ 
                Password: hashedPassword,
                UserType: 'Admin'
            });
            console.log('✅ Admin user updated successfully!');
        } else {
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password', salt);
            
            // Create admin user
            const adminUser = await db.UserLogin.create({
                FirstName: 'Admin',
                LastName: 'User',
                Email: 'admin@example.com',
                Contact: '123-456-7890',
                Address: '123 Admin St',
                City: 'Admin City',
                State: 'AC',
                Zip: '12345',
                Username: 'admin',
                Password: hashedPassword,
                UserType: 'Admin'
            });
            console.log('✅ Admin user created successfully!');
            console.log('User ID:', adminUser.id);
        }
        
        console.log('\n📋 Login Credentials:');
        console.log('Email: admin@example.com');
        console.log('Password: password');
        console.log('User Type: Admin');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        process.exit(1);
    }
}

createAdminUser();
