const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testCreateOnly() {
    try {
        // Login
        const loginResponse = await axios.post(`${BASE_URL}/api/login`, {
            email: 'admin@test.com',
            password: 'admin123'
        });
        
        const token = loginResponse.data.token;
        const adminHeaders = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        // Create Property
        const testProperty = {
            PStreetNum: "789",
            PStreetName: "Final Test Street",
            PCity: "Test City",
            PState: "TS",
            PZip: "54321",
            PCounty: "Test County",
            PType: "Townhouse",
            PSqFt: "1800",
            PYearBuilt: "2021",
            PPrice: 425000,
            PBeds: "3",
            PBaths: "2",
            PFloors: 2,
            PDescription: "Final test property",
            proaddress_id: 2,
            motive_type_id: 5,
            PFilesUrlsId: null
        };
        
        const createResponse = await axios.post(
            `${BASE_URL}/api/admin/properties`,
            testProperty,
            { headers: adminHeaders }
        );
        
        const propertyId = createResponse.data.data?.id || createResponse.data.id;
        console.log('✅ Property created successfully - ID:', propertyId);
        
        // Test GET
        const getResponse = await axios.get(`${BASE_URL}/api/properties/${propertyId}`);
        console.log('✅ Property retrieved:', getResponse.data.PStreetNum);
        
        // Test DELETE
        await axios.delete(`${BASE_URL}/api/admin/properties/${propertyId}`, { headers: adminHeaders });
        console.log('✅ Property deleted successfully');
        
        console.log('\n🎉 Basic CRUD working!');
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testCreateOnly();
