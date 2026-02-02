#!/bin/bash

# API Test Script using curl
# Make sure your server is running on localhost:3001

BASE_URL="http://localhost:3001"
AUTH_TOKEN=""

echo "🚀 Testing Real Estate APIs..."
echo "================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local description=$4
    
    echo -e "\nTesting: $description"
    echo "Request: $method $url"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$BASE_URL$url" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X $method \
            "$BASE_URL$url" 2>/dev/null)
    fi
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    # Extract response body (everything except last line)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        echo -e "${GREEN}✅ Success ($status_code)${NC}"
        echo "Response: $body" | jq . 2>/dev/null || echo "Response: $body"
    else
        echo -e "${RED}❌ Failed ($status_code)${NC}"
        echo "Error: $body" | jq . 2>/dev/null || echo "Error: $body"
    fi
}

# Test Public Endpoints
echo -e "\n${GREEN}=== PUBLIC ENDPOINTS ===${NC}"

test_endpoint "GET" "/api/properties" "" "Get all properties"

test_endpoint "GET" "/api/properties/1" "" "Get property by ID"

test_endpoint "GET" "/api/nearby?city=Test" "" "Get nearby properties"

# Test Authentication
echo -e "\n${GREEN}=== AUTHENTICATION ===${NC}"

# Register new user
register_data='{
    "email": "testuser@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
}'
test_endpoint "POST" "/api/register" "$register_data" "Register new user"

# Login to get token
login_data='{
    "email": "testuser@example.com",
    "password": "password123"
}'
login_response=$(curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$login_data" \
    "$BASE_URL/api/login" 2>/dev/null)

echo -e "\nLogin Response: $login_response"

# Extract token (requires jq)
if command -v jq &> /dev/null; then
    AUTH_TOKEN=$(echo "$login_response" | jq -r '.token // empty')
    if [ -n "$AUTH_TOKEN" ] && [ "$AUTH_TOKEN" != "null" ]; then
        echo -e "${GREEN}✅ Got auth token${NC}"
    else
        echo -e "${RED}❌ Failed to get auth token${NC}"
        AUTH_TOKEN=""
    fi
else
    echo "⚠️  jq not found. Install jq for better parsing."
    echo "Manual token extraction needed from response above."
fi

# Test Admin Endpoints (only if we have a token)
if [ -n "$AUTH_TOKEN" ]; then
    echo -e "\n${GREEN}=== ADMIN ENDPOINTS ===${NC}"
    
    # Create property
    property_data='{
        "PStreetNum": "123",
        "PStreetName": "Test Street",
        "PCity": "Test City",
        "PState": "TS",
        "PZip": "12345",
        "PCounty": "Test County",
        "PType": "Single Family",
        "PSqFt": "2000",
        "PYearBuilt": "2020",
        "PPrice": 350000,
        "PBeds": "3",
        "PBaths": "2",
        "PFloors": 2,
        "PDescription": "Test property",
        "proaddress_id": 1,
        "motive_type_id": 1,
        "PFilesUrlsId": 1
    }'
    
    test_endpoint "POST" "/api/admin/properties" "$property_data" "Create property (Admin)"
    
    # Create auction
    auction_data='{
        "APropertyID": 1,
        "AuctionDate": "2026-03-15",
        "StartingBid": 150000,
        "AuctionTime": "10:00:00",
        "AuctionLocation": "County Courthouse"
    }'
    
    test_endpoint "POST" "/api/admin/auctions" "$auction_data" "Create auction (Admin)"
    
    # Test crawler endpoints
    test_endpoint "GET" "/api/admin/crawler/runs" "" "Get crawler runs (Admin)"
    test_endpoint "GET" "/api/admin/crawler/errors" "" "Get crawler errors (Admin)"
    
else
    echo -e "\n${RED}=== SKIPPING ADMIN ENDPOINTS (No Auth Token) ===${NC}"
fi

# Test Error Cases
echo -e "\n${GREEN}=== ERROR CASES ===${NC}"

test_endpoint "GET" "/api/admin/properties" "" "Unauthorized admin access"

test_endpoint "GET" "/api/properties/99999" "" "Non-existent property"

test_endpoint "POST" "/api/login" '{"email": "fake@email.com", "password": "wrong"}' "Invalid login"

echo -e "\n${GREEN}=== TEST COMPLETE ===${NC}"
echo "📝 Check the results above:"
echo "✅ = Working correctly"
echo "❌ = Needs attention"
echo ""
echo "🔧 Troubleshooting tips:"
echo "1. Make sure your server is running: npm start or node index.js"
echo "2. Check database connection in config/config.js"
echo "3. Ensure user_login table has an Admin user"
echo "4. Verify JWT_SECRET environment variable is set"
