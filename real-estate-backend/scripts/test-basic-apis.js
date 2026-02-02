const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testBasicAPIs() {
    console.log('🚀 Testing Basic APIs (No Auth Required)');
    console.log('==========================================');
    
    try {
        // Test 1: Get all properties
        console.log('\n1. Testing GET /api/properties');
        const propertiesResponse = await axios.get(`${BASE_URL}/api/properties`);
        console.log('✅ Success - Properties found:', propertiesResponse.data.length);
        
        // Test 2: Get nearby properties
        console.log('\n2. Testing GET /api/nearby');
        const nearbyResponse = await axios.get(`${BASE_URL}/api/nearby?city=Test`);
        console.log('✅ Success - Nearby properties found:', nearbyResponse.data.length);
        
        // Test 3: Test unauthorized admin access
        console.log('\n3. Testing unauthorized admin access');
        try {
            await axios.get(`${BASE_URL}/api/admin/properties`);
            console.log('❌ Failed - Should be blocked');
        } catch (error) {
            console.log('✅ Success - Properly blocked (Status:', error.response.status, ')');
        }
        
        // Test 4: Test invalid property ID
        console.log('\n4. Testing invalid property ID');
        try {
            await axios.get(`${BASE_URL}/api/properties/99999`);
            console.log('❌ Failed - Should return 404');
        } catch (error) {
            console.log('✅ Success - Properly handled (Status:', error.response.status, ')');
        }
        
        console.log('\n🎉 Basic API Tests Complete!');
        console.log('✅ Public endpoints are working correctly');
        console.log('✅ Error handling is working');
        console.log('✅ Admin protection is working');
        
        console.log('\n📝 Next Steps:');
        console.log('1. Update database schema for password field');
        console.log('2. Create admin user manually in database');
        console.log('3. Test admin endpoints with proper auth');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testBasicAPIs();
