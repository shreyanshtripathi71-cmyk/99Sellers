# Quick API Testing Commands

## Start Server First
```bash
npm start
```

## Test Public Endpoints
```bash
# Get all properties
curl http://localhost:3001/api/properties

# Get specific property
curl http://localhost:3001/api/properties/1

# Test registration
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Test login (get token)
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Test Admin Endpoints (replace TOKEN with actual token)
```bash
# Create property
curl -X POST http://localhost:3001/api/admin/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"PStreetNum":"123","PStreetName":"Test St","PCity":"Test City","PState":"TS","PZip":"12345","PCounty":"Test County","PType":"Single Family","PSqFt":"2000","PYearBuilt":"2020","PPrice":350000,"PBeds":"3","PBaths":"2","PFloors":2,"PDescription":"Test property","proaddress_id":1,"motive_type_id":1,"PFilesUrlsId":1}'

# Update property
curl -X PUT http://localhost:3001/api/admin/properties/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"PPrice":400000,"PDescription":"Updated description"}'

# Create auction
curl -X POST http://localhost:3001/api/admin/auctions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"APropertyID":1,"AuctionDate":"2026-03-15","StartingBid":150000,"AuctionTime":"10:00:00","AuctionLocation":"County Courthouse"}'

# Get crawler runs
curl -X GET http://localhost:3001/api/admin/crawler/runs \
  -H "Authorization: Bearer TOKEN"
```

## Expected Results
✅ = Working (200-299 status code)
❌ = Not working (400+ status code)

## Common Issues & Fixes
1. **Server not running**: Start with `npm start`
2. **Database connection**: Check config/config.js
3. **Admin user missing**: Create admin in user_login table
4. **JWT_SECRET missing**: Set environment variable
5. **CORS issues**: Check frontend URL in cors config
