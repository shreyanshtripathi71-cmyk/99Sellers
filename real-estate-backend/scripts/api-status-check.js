const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function checkAPIStatus() {
    console.log('🔍 COMPREHENSIVE API STATUS CHECK');
    console.log('==================================');
    
    try {
        // Login first
        const loginResponse = await axios.post(`${BASE_URL}/api/login`, {
            email: 'admin@test.com',
            password: 'admin123'
        });
        
        const token = loginResponse.data.token;
        const adminHeaders = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        console.log('\n🔐 Authentication: ✅ Working');
        
        // Test all API endpoints
        const apiTests = [
            // Property APIs
            { name: 'GET /api/admin/properties', method: 'GET', url: '/api/admin/properties' },
            { name: 'GET /api/admin/properties/stats', method: 'GET', url: '/api/admin/properties/stats' },
            
            // Auction APIs
            { name: 'GET /api/admin/auctions', method: 'GET', url: '/api/admin/auctions' },
            { name: 'GET /api/admin/auctions/upcoming', method: 'GET', url: '/api/admin/auctions/upcoming' },
            
            // Owner APIs
            { name: 'GET /api/admin/owners', method: 'GET', url: '/api/admin/owners' },
            
            // Loan APIs
            { name: 'GET /api/admin/loans', method: 'GET', url: '/api/admin/loans' },
            { name: 'GET /api/admin/loans/stats', method: 'GET', url: '/api/admin/loans/stats' },
            
            // User APIs
            { name: 'GET /api/admin/users', method: 'GET', url: '/api/admin/users' },
            { name: 'GET /api/admin/users/stats', method: 'GET', url: '/api/admin/users/stats' },
            
            // Crawler APIs
            { name: 'GET /api/admin/crawler/runs', method: 'GET', url: '/api/admin/crawler/runs' },
            { name: 'GET /api/admin/crawler/errors', method: 'GET', url: '/api/admin/crawler/errors' }
        ];
        
        let workingCount = 0;
        let totalCount = apiTests.length;
        
        for (const api of apiTests) {
            try {
                const response = await axios.get(`${BASE_URL}${api.url}`, { headers: adminHeaders });
                console.log(`✅ ${api.name} - Working (${response.status})`);
                workingCount++;
            } catch (error) {
                console.log(`❌ ${api.name} - Failed (${error.response?.status || 'No response'})`);
                if (error.response?.data) {
                    console.log(`   Error: ${error.response.data.error || error.response.data.message}`);
                }
            }
        }
        
        // Test POST endpoints
        console.log('\n📝 Testing POST Endpoints:');
        
        const postTests = [
            {
                name: 'POST /api/admin/properties',
                url: '/api/admin/properties',
                data: {
                    PStreetNum: "999",
                    PStreetName: "Status Test",
                    PCity: "Test City",
                    PState: "TS",
                    PZip: "99999",
                    PCounty: "Test County",
                    PType: "Test",
                    PSqFt: "1000",
                    PYearBuilt: "2020",
                    PPrice: 100000,
                    PBeds: "2",
                    PBaths: "1",
                    PFloors: 1,
                    PDescription: "Status test property",
                    proaddress_id: 2,
                    motive_type_id: 5,
                    PFilesUrlsId: null
                }
            },
            {
                name: 'POST /api/admin/owners',
                url: '/api/admin/owners',
                data: {
                    OLastName: "Status",
                    OMiddleName: "Test",
                    OFirstName: "Owner",
                    OStreetAddr1: "123 Test St",
                    OStreetAddr2: "Apt 100",
                    OCity: "Test City",
                    OState: "TS",
                    OZip: "99999",
                    OProperty_id: 1,
                    insert_id: 1
                }
            },
            {
                name: 'POST /api/admin/loans',
                url: '/api/admin/loans',
                data: {
                    property_id: 1,
                    deed_id: "STATUS-001",
                    borrower_name: "Status Borrower",
                    lender_name: "Status Lender",
                    lender_address: "123 Lender St",
                    datetime: new Date(),
                    loan_amount: 50000
                }
            },
            {
                name: 'POST /api/admin/auctions',
                url: '/api/admin/auctions',
                data: {
                    AAuctionDateTime: "2026-12-15T10:00:00Z",
                    AAuctionPlace: "Status Auction Hall",
                    AAuctionPlaceAddr1: "456 Status Ave",
                    AAuctionPlaceAddr2: "Suite 100",
                    AAuctionCity: "Status City",
                    AAuctionState: "SC",
                    AAuctionZip: 99999,
                    AAuctionDescription: "Status test auction",
                    APropertyID: 1
                }
            }
        ];
        
        for (const api of postTests) {
            try {
                const response = await axios.post(`${BASE_URL}${api.url}`, api.data, { headers: adminHeaders });
                console.log(`✅ ${api.name} - Working (${response.status})`);
                workingCount++;
            } catch (error) {
                console.log(`❌ ${api.name} - Failed (${error.response?.status || 'No response'})`);
                if (error.response?.data) {
                    console.log(`   Error: ${error.response.data.error || error.response.data.message}`);
                }
            }
        }
        
        totalCount += postTests.length;
        
        // Test Public APIs
        console.log('\n🌐 Testing Public APIs:');
        
        const publicTests = [
            { name: 'GET /api/properties', method: 'GET', url: '/api/properties' },
            { name: 'GET /api/nearby', method: 'GET', url: '/api/nearby?city=Test' }
        ];
        
        for (const api of publicTests) {
            try {
                const response = await axios.get(`${BASE_URL}${api.url}`);
                console.log(`✅ ${api.name} - Working (${response.status})`);
                workingCount++;
            } catch (error) {
                console.log(`❌ ${api.name} - Failed (${error.response?.status || 'No response'})`);
            }
        }
        
        totalCount += publicTests.length;
        
        // Test Security
        console.log('\n🛡️  Testing Security:');
        
        try {
            await axios.get(`${BASE_URL}/api/admin/properties`);
            console.log('❌ Public access to admin endpoints - FAILED (should be blocked)');
        } catch (error) {
            console.log('✅ Public access properly blocked - Working');
        }
        
        console.log('\n📊 API STATUS SUMMARY');
        console.log('=====================');
        console.log(`✅ Working APIs: ${workingCount}/${totalCount}`);
        console.log(`❌ Failed APIs: ${totalCount - workingCount}/${totalCount}`);
        console.log(`📈 Success Rate: ${Math.round((workingCount / totalCount) * 100)}%`);
        
        if (workingCount === totalCount) {
            console.log('\n🎉 ALL APIs ARE WORKING PERFECTLY!');
            console.log('Your B2B SaaS Real Estate Admin Dashboard is 100% Functional!');
        } else {
            console.log('\n⚠️  Some APIs need attention. Check the failed endpoints above.');
        }
        
    } catch (error) {
        console.error('❌ Status check failed:', error.message);
    }
}

checkAPIStatus();
