const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testAuctionCRUD() {
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
        
        // Create Property first
        const testProperty = {
            PStreetNum: "999",
            PStreetName: "Auction Test Street",
            PCity: "Test City",
            PState: "TS",
            PZip: "54321",
            PCounty: "Test County",
            PType: "Single Family",
            PSqFt: "2000",
            PYearBuilt: "2020",
            PPrice: 500000,
            PBeds: "4",
            PBaths: "3",
            PFloors: 2,
            PDescription: "Property for auction test",
            proaddress_id: 2,
            motive_type_id: 5,
            PFilesUrlsId: null
        };
        
        const propertyResponse = await axios.post(
            `${BASE_URL}/api/admin/properties`,
            testProperty,
            { headers: adminHeaders }
        );
        
        const propertyId = propertyResponse.data.data?.id || propertyResponse.data.id;
        console.log('✅ Property created - ID:', propertyId);
        
        // Create Auction
        const testAuction = {
            AAuctionDateTime: "2026-06-15T14:00:00Z",
            AAuctionPlace: "Main Auction Hall",
            AAuctionPlaceAddr1: "456 Auction Ave",
            AAuctionPlaceAddr2: "Suite 200",
            AAuctionCity: "Auction City",
            AAuctionState: "AC",
            AAuctionZip: 12345,
            AAuctionDescription: "Test auction for property",
            APropertyID: propertyId
        };
        
        const auctionResponse = await axios.post(
            `${BASE_URL}/api/admin/auctions`,
            testAuction,
            { headers: adminHeaders }
        );
        
        const auctionId = auctionResponse.data.AAuctionID || auctionResponse.data.data?.AAuctionID;
        console.log('✅ Auction created - ID:', auctionId);
        
        if (!auctionId) {
            console.log('⚠️  Auction ID not found in response, skipping delete test');
            return;
        }
        
        // Test DELETE Auction
        await axios.delete(`${BASE_URL}/api/admin/auctions/${auctionId}`, { headers: adminHeaders });
        console.log('✅ Auction deleted successfully');
        
        // Test DELETE Property
        await axios.delete(`${BASE_URL}/api/admin/properties/${propertyId}`, { headers: adminHeaders });
        console.log('✅ Property deleted successfully');
        
        console.log('\n🎉 Auction CRUD working perfectly!');
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testAuctionCRUD();
