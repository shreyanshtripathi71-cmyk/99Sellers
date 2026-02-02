const fs = require('fs');
const path = require('path');

function setupEnvironment() {
    const envPath = path.join(__dirname, '..', '.env');
    const envExamplePath = path.join(__dirname, '..', '.env.example');
    
    console.log('🔧 Setting up environment variables...');
    
    // Read existing .env file or create it
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Add JWT_SECRET if not present
    if (!envContent.includes('JWT_SECRET=')) {
        envContent += '\n# JWT Configuration\nJWT_SECRET=your-super-secret-jwt-key-for-production\n';
        console.log('✅ Added JWT_SECRET to .env');
    } else {
        console.log('✅ JWT_SECRET already exists in .env');
    }
    
    // Add fallback JWT_SECRET for development
    if (!envContent.includes('JWT_SECRET=')) {
        envContent += '\n# Fallback for development\nJWT_SECRET=fallback-secret-key-for-testing\n';
        console.log('✅ Added fallback JWT_SECRET');
    }
    
    // Write back to .env
    fs.writeFileSync(envPath, envContent);
    
    console.log('🎉 Environment setup complete!');
    console.log('Please update your .env file with actual values for production.');
}

setupEnvironment();
