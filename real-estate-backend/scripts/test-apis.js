const axios = require('axios');

// Base URL for your API
const BASE_URL = 'http://localhost:3001';

// Test data
const testProperty = {
    PStreetNum: "123",
    PStreetName: "Test Street",
    PCity: "Test City",
    PState: "TS",
    PZip: "12345",
    PCounty: "Test County",
    PType: "Single Family",
    PSqFt: "2000",
    PYearBuilt: "2020",
    PPrice: 350000,
    PBeds: "3",
    PBaths: "2",
    PFloors: 2,
    PDescription: "Test property for API testing",
    proaddress_id: 1,
    motive_type_id: 1,
    PFilesUrlsId: 1
};

const testAuction = {
    APropertyID: 1,
    AuctionDate: "2026-03-15",
    StartingBid: 150000,
    AuctionTime: "10:00:00",
    AuctionLocation: "County Courthouse"
};

// Store created IDs for update/delete tests
let createdPropertyId = null;
let createdAuctionId = null;
let authToken = null;

// Helper function to make requests
async function makeRequest(method, url, data = null, headers = {}) {
    try {
        const config = {
            method,
            url: `${BASE_URL}${url}`,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };
        
        if (data) {
            config.data = data;
        }
        
        const response = await axios(config);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        let errorMessage = 'Unknown error';
        let statusCode = 500;
        
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            errorMessage = typeof error.response.data === 'string' 
                ? error.response.data 
                : JSON.stringify(error.response.data);
            statusCode = error.response.status;
        } else if (error.request) {
            // The request was made but no response was received
            errorMessage = 'No response from server - is it running?';
        } else {
            // Something happened in setting up the request that triggered an Error
            errorMessage = error.message;
        }
        
        return { 
            success: false, 
            error: errorMessage, 
            status: statusCode 
        };
    }
}

// Test functions
async function testPublicAuth() {
    console.log('\n=== Testing Public Authentication ===');
    
    // Test registration
    const registerResult = await makeRequest('POST', '/api/register', {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        contact: '123-456-7890',
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zip: '12345'
    });
    console.log('Register:', registerResult.success ? '✅ Success' : `❌ Failed - ${registerResult.error}`);
    
    // Test login
    const loginResult = await makeRequest('POST', '/api/login', {
        email: 'test@example.com',
        password: 'password123'
    });
    
    if (loginResult.success) {
        authToken = loginResult.data.token;
        console.log('Login: ✅ Success');
    } else {
        console.log('Login: ❌ Failed -', loginResult.error);
    }
}

async function testPublicEndpoints() {
    console.log('\n=== Testing Public Endpoints ===');
    
    // Test get all properties
    const propertiesResult = await makeRequest('GET', '/api/properties');
    console.log('Get Properties:', propertiesResult.success ? '✅ Success' : `❌ Failed - ${propertiesResult.error}`);
    
    // Test get property by ID (assuming property with ID 1 exists)
    const propertyResult = await makeRequest('GET', '/api/properties/1');
    console.log('Get Property by ID:', propertyResult.success ? '✅ Success' : `❌ Failed - ${propertyResult.error}`);
    
    // Test nearby properties
    const nearbyResult = await makeRequest('GET', '/api/nearby?city=Test City');
    console.log('Get Nearby Properties:', nearbyResult.success ? '✅ Success' : `❌ Failed - ${nearbyResult.error}`);
}

async function testAdminEndpoints() {
    console.log('\n=== Testing Admin Endpoints ===');
    
    if (!authToken) {
        console.log('❌ No auth token available. Run auth tests first.');
        return;
    }
    
    const adminHeaders = {
        'Authorization': `Bearer ${authToken}`
    };
    
    // Test create property
    const createPropertyResult = await makeRequest('POST', '/api/admin/properties', testProperty, adminHeaders);
    if (createPropertyResult.success) {
        createdPropertyId = createPropertyResult.data.data?.id || createPropertyResult.data.id || 1;
        console.log('Create Property: ✅ Success');
    } else {
        console.log('Create Property: ❌ Failed -', createPropertyResult.error);
    }
    
    // Test create auction
    const createAuctionResult = await makeRequest('POST', '/api/admin/auctions', testAuction, adminHeaders);
    if (createAuctionResult.success) {
        createdAuctionId = createAuctionResult.data.data?.id || createAuctionResult.data.id || 1;
        console.log('Create Auction: ✅ Success');
    } else {
        console.log('Create Auction: ❌ Failed -', createAuctionResult.error);
    }
    
    // Wait a bit before testing updates
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test update property
    if (createdPropertyId) {
        const updatePropertyResult = await makeRequest('PUT', `/api/admin/properties/${createdPropertyId}`, 
            { PPrice: 400000, PDescription: "Updated property description" }, adminHeaders);
        console.log('Update Property:', updatePropertyResult.success ? '✅ Success' : `❌ Failed - ${updatePropertyResult.error}`);
    }
    
    // Test update auction
    if (createdAuctionId) {
        const updateAuctionResult = await makeRequest('PUT', `/api/admin/auctions/${createdAuctionId}`, 
            { StartingBid: 175000, AuctionDate: "2026-03-20" }, adminHeaders);
        console.log('Update Auction:', updateAuctionResult.success ? '✅ Success' : `❌ Failed - ${updateAuctionResult.error}`);
    }
    
    // Test crawler endpoints
    const crawlerRunsResult = await makeRequest('GET', '/api/admin/crawler/runs', null, adminHeaders);
    console.log('Get Crawler Runs:', crawlerRunsResult.success ? '✅ Success' : `❌ Failed - ${crawlerRunsResult.error}`);
    
    const crawlerErrorsResult = await makeRequest('GET', '/api/admin/crawler/errors', null, adminHeaders);
    console.log('Get Crawler Errors:', crawlerErrorsResult.success ? '✅ Success' : `❌ Failed - ${crawlerErrorsResult.error}`);
}

async function testErrorCases() {
    console.log('\n=== Testing Error Cases ===');
    
    // Test unauthorized access
    const unauthorizedResult = await makeRequest('GET', '/api/admin/properties');
    console.log('Unauthorized Access:', !unauthorizedResult.success ? '✅ Properly blocked' : '❌ Should be blocked');
    
    // Test invalid property ID
    const invalidPropertyResult = await makeRequest('GET', '/api/properties/99999');
    console.log('Invalid Property ID:', !invalidPropertyResult.success ? '✅ Properly handled' : '❌ Should return 404');
    
    // Test invalid login
    const invalidLoginResult = await makeRequest('POST', '/api/login', {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
    });
    console.log('Invalid Login:', !invalidLoginResult.success ? '✅ Properly rejected' : '❌ Should reject invalid credentials');
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Starting API Tests...');
    console.log('Make sure your server is running on', BASE_URL);
    
    try {
        await testPublicAuth();
        await testPublicEndpoints();
        await testAdminEndpoints();
        await testErrorCases();
        
        console.log('\n✅ All tests completed!');
        console.log('\n📝 Summary:');
        console.log('- Check ✅ marks for successful operations');
        console.log('- Check ❌ marks for failed operations');
        console.log('- Make sure your database is properly configured');
        console.log('- Ensure you have an admin user in the user_login table');
        
    } catch (error) {
        console.error('❌ Test suite failed:', error.message);
    }
}

// Run tests
if (require.main === module) {
    runAllTests();
}

module.exports = { runAllTests, makeRequest };
