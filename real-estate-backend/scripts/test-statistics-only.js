const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testStatisticsOnly() {
    console.log('📊 TESTING STATISTICS APIS ONLY');
    console.log('================================');
    
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
        
        console.log('✅ Admin authenticated');
        
        // Test Loan Statistics
        console.log('\n📊 Testing Loan Statistics...');
        try {
            const loanStatsResponse = await axios.get(`${BASE_URL}/api/admin/loans/stats`, { headers: adminHeaders });
            console.log('✅ Loan Statistics Response:', loanStatsResponse.data);
        } catch (error) {
            console.log('❌ Loan Statistics Error:', error.response?.status, error.response?.data);
        }
        
        // Test User Statistics
        console.log('\n👥 Testing User Statistics...');
        try {
            const userStatsResponse = await axios.get(`${BASE_URL}/api/admin/users/stats`, { headers: adminHeaders });
            console.log('✅ User Statistics Response:', userStatsResponse.data);
        } catch (error) {
            console.log('❌ User Statistics Error:', error.response?.status, error.response?.data);
        }
        
        // Test Property Statistics (working)
        console.log('\n🏠 Testing Property Statistics...');
        try {
            const propStatsResponse = await axios.get(`${BASE_URL}/api/admin/properties/stats`, { headers: adminHeaders });
            console.log('✅ Property Statistics Response:', propStatsResponse.data);
        } catch (error) {
            console.log('❌ Property Statistics Error:', error.response?.status, error.response?.data);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testStatisticsOnly();
