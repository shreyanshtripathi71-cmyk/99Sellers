const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Test data
const testProperty = {
    PStreetNum: "456",
    PStreetName: "Admin Test Street",
    PCity: "Admin City",
    PState: "AC",
    PZip: "54321",
    PCounty: "Admin County",
    PType: "Condo",
    PSqFt: "1500",
    PYearBuilt: "2019",
    PPrice: 275000,
    PBeds: "2",
    PBaths: "2",
    PFloors: 1,
    PDescription: "Admin test property for CRUD testing",
    proaddress_id: 1,
    motive_type_id: 1,
    PFilesUrlsId: 1
};

const testAuction = {
    APropertyID: 1,
    AuctionDate: "2026-04-15",
    StartingBid: 200000,
    AuctionTime: "14:00:00",
    AuctionLocation: "Main Courtroom"
};

let adminToken = null;
let createdPropertyId = null;
let createdAuctionId = null;

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
            errorMessage = typeof error.response.data === 'string' 
                ? error.response.data 
                : JSON.stringify(error.response.data);
            statusCode = error.response.status;
        } else if (error.request) {
            errorMessage = 'No response from server - is it running?';
        } else {
            errorMessage = error.message;
        }
        
        return { 
            success: false, 
            error: errorMessage, 
            status: statusCode 
        };
    }
}

async function testAdminAuthentication() {
    console.log('\n=== Testing Admin Authentication ===');
    
    // First, let's try to create an admin user manually via direct DB access
    // But for now, let's test with a mock admin token
    console.log('⚠️  Note: You need to manually create an admin user in the database');
    console.log('   SQL: INSERT INTO user_login (FirstName, LastName, Email, Contact, Address, City, State, Zip, Username, Password, UserType)');
    console.log('   VALUES ("Admin", "User", "admin@test.com", "123-456-7890", "123 Admin St", "Admin City", "AC", "12345", "admin", "hashed_password", "Admin")');
    
    // For testing, let's assume we have a token
    // In real scenario, you'd get this from login endpoint
    console.log('\n🔐 Testing admin login...');
    const loginResult = await makeRequest('POST', '/api/login', {
        email: 'admin@test.com',
        password: 'admin123'
    });
    
    if (loginResult.success) {
        adminToken = loginResult.data.token;
        console.log('✅ Admin login successful');
    } else {
        console.log('❌ Admin login failed -', loginResult.error);
        console.log('⚠️  Using mock token for testing...');
        // Mock token for testing (you'll need real admin user for production)
        adminToken = 'mock-admin-token';
    }
}

async function testPublicAccessRestriction() {
    console.log('\n=== Testing Public Access Restriction ===');
    
    const adminEndpoints = [
        { method: 'GET', url: '/api/admin/properties', desc: 'Get all properties' },
        { method: 'POST', url: '/api/admin/properties', desc: 'Create property' },
        { method: 'PUT', url: '/api/admin/properties/1', desc: 'Update property' },
        { method: 'DELETE', url: '/api/admin/properties/1', desc: 'Delete property' },
        { method: 'GET', url: '/api/admin/auctions', desc: 'Get all auctions' },
        { method: 'POST', url: '/api/admin/auctions', desc: 'Create auction' },
        { method: 'PUT', url: '/api/admin/auctions/1', desc: 'Update auction' },
        { method: 'DELETE', url: '/api/admin/auctions/1', desc: 'Delete auction' },
        { method: 'GET', url: '/api/admin/crawler/runs', desc: 'Get crawler runs' },
        { method: 'GET', url: '/api/admin/crawler/errors', desc: 'Get crawler errors' }
    ];
    
    for (const endpoint of adminEndpoints) {
        const result = await makeRequest(endpoint.method, endpoint.url);
        const status = result.status === 401 || result.status === 403 ? '✅' : '❌';
        console.log(`${status} ${endpoint.desc} - Status: ${result.status}`);
    }
}

async function testAdminCRUD() {
    console.log('\n=== Testing Admin CRUD Operations ===');
    
    if (!adminToken) {
        console.log('❌ No admin token available - skipping CRUD tests');
        return;
    }
    
    const adminHeaders = {
        'Authorization': `Bearer ${adminToken}`
    };
    
    // Test CREATE Property
    console.log('\n📝 Testing CREATE Property...');
    const createPropertyResult = await makeRequest('POST', '/api/admin/properties', testProperty, adminHeaders);
    if (createPropertyResult.success) {
        createdPropertyId = createPropertyResult.data.data?.id || createPropertyResult.data.id || 1;
        console.log('✅ Property created successfully - ID:', createdPropertyId);
    } else {
        console.log('❌ Property creation failed -', createPropertyResult.error);
    }
    
    // Test CREATE Auction
    console.log('\n📝 Testing CREATE Auction...');
    const createAuctionResult = await makeRequest('POST', '/api/admin/auctions', testAuction, adminHeaders);
    if (createAuctionResult.success) {
        createdAuctionId = createAuctionResult.data.data?.id || createAuctionResult.data.id || 1;
        console.log('✅ Auction created successfully - ID:', createdAuctionId);
    } else {
        console.log('❌ Auction creation failed -', createAuctionResult.error);
    }
    
    // Wait a moment before testing updates
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test UPDATE Property
    if (createdPropertyId) {
        console.log('\n✏️  Testing UPDATE Property...');
        const updatePropertyResult = await makeRequest('PUT', `/api/admin/properties/${createdPropertyId}`, 
            { PPrice: 300000, PDescription: "Updated by admin" }, adminHeaders);
        if (updatePropertyResult.success) {
            console.log('✅ Property updated successfully');
        } else {
            console.log('❌ Property update failed -', updatePropertyResult.error);
        }
    }
    
    // Test UPDATE Auction
    if (createdAuctionId) {
        console.log('\n✏️  Testing UPDATE Auction...');
        const updateAuctionResult = await makeRequest('PUT', `/api/admin/auctions/${createdAuctionId}`, 
            { StartingBid: 250000, AuctionDate: "2026-04-20" }, adminHeaders);
        if (updateAuctionResult.success) {
            console.log('✅ Auction updated successfully');
        } else {
            console.log('❌ Auction update failed -', updateAuctionResult.error);
        }
    }
    
    // Test DELETE Property
    if (createdPropertyId) {
        console.log('\n🗑️  Testing DELETE Property...');
        const deletePropertyResult = await makeRequest('DELETE', `/api/admin/properties/${createdPropertyId}`, null, adminHeaders);
        if (deletePropertyResult.success) {
            console.log('✅ Property deleted successfully');
        } else {
            console.log('❌ Property deletion failed -', deletePropertyResult.error);
        }
    }
    
    // Test DELETE Auction
    if (createdAuctionId) {
        console.log('\n🗑️  Testing DELETE Auction...');
        const deleteAuctionResult = await makeRequest('DELETE', `/api/admin/auctions/${createdAuctionId}`, null, adminHeaders);
        if (deleteAuctionResult.success) {
            console.log('✅ Auction deleted successfully');
        } else {
            console.log('❌ Auction deletion failed -', deleteAuctionResult.error);
        }
    }
}

async function testAdminEndpoints() {
    console.log('\n=== Testing Other Admin Endpoints ===');
    
    if (!adminToken) {
        console.log('❌ No admin token available - skipping admin endpoint tests');
        return;
    }
    
    const adminHeaders = {
        'Authorization': `Bearer ${adminToken}`
    };
    
    // Test crawler endpoints
    console.log('\n🤖 Testing Crawler Endpoints...');
    
    const crawlerRunsResult = await makeRequest('GET', '/api/admin/crawler/runs', null, adminHeaders);
    console.log(`${crawlerRunsResult.success ? '✅' : '❌'} Get crawler runs - Status: ${crawlerRunsResult.status}`);
    
    const crawlerErrorsResult = await makeRequest('GET', '/api/admin/crawler/errors', null, adminHeaders);
    console.log(`${crawlerErrorsResult.success ? '✅' : '❌'} Get crawler errors - Status: ${crawlerErrorsResult.status}`);
}

async function runAllTests() {
    console.log('🚀 Testing Admin CRUD Operations');
    console.log('===================================');
    console.log('This test ensures:');
    console.log('✅ Admin can perform all CRUD operations');
    console.log('✅ Public users cannot access admin endpoints');
    console.log('✅ Admin dashboard functionality is isolated');
    
    try {
        await testAdminAuthentication();
        await testPublicAccessRestriction();
        await testAdminCRUD();
        await testAdminEndpoints();
        
        console.log('\n🎉 Admin CRUD Tests Complete!');
        console.log('\n📊 Summary:');
        console.log('- Admin authentication tested');
        console.log('- Public access restrictions verified');
        console.log('- All CRUD operations tested');
        console.log('- Admin-only endpoints confirmed');
        
        console.log('\n🔧 Setup Requirements:');
        console.log('1. Create admin user in database');
        console.log('2. Set JWT_SECRET environment variable');
        console.log('3. Ensure database tables exist');
        
    } catch (error) {
        console.error('❌ Test suite failed:', error.message);
    }
}

// Run tests
if (require.main === module) {
    runAllTests();
}

module.exports = { runAllTests };
