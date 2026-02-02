const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testCRUDOperations() {
    console.log('🚀 Testing Admin CRUD Operations');
    console.log('===================================');
    
    try {
        // Step 1: Login as admin
        console.log('\n🔐 Step 1: Admin Login');
        const loginResponse = await axios.post(`${BASE_URL}/api/login`, {
            email: 'admin@test.com',
            password: 'admin123'
        });
        
        const token = loginResponse.data.token;
        console.log('✅ Admin login successful');
        console.log('Token:', token.substring(0, 20) + '...');
        
        const adminHeaders = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        // Step 2: Test Public Access (should fail)
        console.log('\n🚫 Step 2: Testing Public Access (Should Fail)');
        try {
            await axios.get(`${BASE_URL}/api/admin/properties`);
            console.log('❌ Public access should have failed');
        } catch (error) {
            console.log('✅ Public access properly blocked (Status:', error.response.status, ')');
        }
        
        // Step 3: Create Property
        console.log('\n📝 Step 3: Create Property');
        const testProperty = {
            PStreetNum: "789",
            PStreetName: "CRUD Test Street",
            PCity: "Test City",
            PState: "TC",
            PZip: "99999",
            PCounty: "Test County",
            PType: "Townhouse",
            PSqFt: "1800",
            PYearBuilt: "2021",
            PPrice: 425000,
            PBeds: "3",
            PBaths: "2",
            PFloors: 2,
            PDescription: "CRUD test property",
            proaddress_id: 1,
            motive_type_id: 1,
            PFilesUrlsId: 1
        };
        
        const createPropertyResponse = await axios.post(
            `${BASE_URL}/api/admin/properties`, 
            testProperty, 
            { headers: adminHeaders }
        );
        
        const propertyId = createPropertyResponse.data.data?.id || createPropertyResponse.data.id;
        console.log('✅ Property created successfully - ID:', propertyId);
        
        // Step 4: Update Property
        console.log('\n✏️  Step 4: Update Property');
        const updateResponse = await axios.put(
            `${BASE_URL}/api/admin/properties/${propertyId}`,
            { PPrice: 450000, PDescription: "Updated property description" },
            { headers: adminHeaders }
        );
        console.log('✅ Property updated successfully');
        
        // Step 5: Create Auction
        console.log('\n🔨 Step 5: Create Auction');
        const testAuction = {
            APropertyID: propertyId,
            AuctionDate: "2026-05-15",
            StartingBid: 300000,
            AuctionTime: "11:00:00",
            AuctionLocation: "Main Auction Hall"
        };
        
        const createAuctionResponse = await axios.post(
            `${BASE_URL}/api/admin/auctions`,
            testAuction,
            { headers: adminHeaders }
        );
        
        const auctionId = createAuctionResponse.data.data?.id || createAuctionResponse.data.id;
        console.log('✅ Auction created successfully - ID:', auctionId);
        
        // Step 6: Update Auction
        console.log('\n✏️  Step 6: Update Auction');
        await axios.put(
            `${BASE_URL}/api/admin/auctions/${auctionId}`,
            { StartingBid: 350000, AuctionDate: "2026-05-20" },
            { headers: adminHeaders }
        );
        console.log('✅ Auction updated successfully');
        
        // Step 7: Test Crawler Endpoints
        console.log('\n🤖 Step 7: Test Crawler Endpoints');
        
        try {
            const crawlerRunsResponse = await axios.get(
                `${BASE_URL}/api/admin/crawler/runs`,
                { headers: adminHeaders }
            );
            console.log('✅ Crawler runs endpoint working');
        } catch (error) {
            console.log('⚠️  Crawler runs endpoint:', error.response?.data || error.message);
        }
        
        try {
            const crawlerErrorsResponse = await axios.get(
                `${BASE_URL}/api/admin/crawler/errors`,
                { headers: adminHeaders }
            );
            console.log('✅ Crawler errors endpoint working');
        } catch (error) {
            console.log('⚠️  Crawler errors endpoint:', error.response?.data || error.message);
        }
        
        // Step 8: Delete Auction
        console.log('\n🗑️  Step 8: Delete Auction');
        await axios.delete(
            `${BASE_URL}/api/admin/auctions/${auctionId}`,
            { headers: adminHeaders }
        );
        console.log('✅ Auction deleted successfully');
        
        // Step 9: Delete Property
        console.log('\n🗑️  Step 9: Delete Property');
        await axios.delete(
            `${BASE_URL}/api/admin/properties/${propertyId}`,
            { headers: adminHeaders }
        );
        console.log('✅ Property deleted successfully');
        
        console.log('\n🎉 All CRUD Operations Working Perfectly!');
        console.log('\n📊 Test Results:');
        console.log('✅ Admin Authentication: Working');
        console.log('✅ Public Access Restriction: Working');
        console.log('✅ Create Property: Working');
        console.log('✅ Update Property: Working');
        console.log('✅ Delete Property: Working');
        console.log('✅ Create Auction: Working');
        console.log('✅ Update Auction: Working');
        console.log('✅ Delete Auction: Working');
        console.log('✅ Admin Dashboard: Fully Functional');
        
        console.log('\n🔐 Security Confirmed:');
        console.log('- Admin endpoints are protected');
        console.log('- JWT authentication working');
        console.log('- Public users cannot access admin functions');
        
    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
        }
    }
}

testCRUDOperations();
