# 🌐 Public User Features - B2B SaaS Real Estate Platform

## 📊 **User Access Levels**

### **🆓 Free Users**
- Limited property information
- Masked sensitive data
- Basic search functionality
- Limited results per page

### **💎 Paid Users (Premium)**
- Complete property information
- Full access to leads
- Advanced search & filters
- Unlimited results
- Export capabilities
- Real-time notifications

---

## 🏠 **Property Features**

### **Free User Access**
```json
{
  "id": 123,
  "PStreetNum": "***",
  "PStreetName": "Main St",
  "PCity": "Test City",
  "PState": "TS",
  "PZip": "12***",
  "PCounty": "Test County",
  "PType": "Single Family",
  "PSqFt": "2***",
  "PYearBuilt": "20**",
  "PPrice": "***,***",
  "PBeds": "*",
  "PBaths": "*",
  "PFloors": "*",
  "PDescription": "Limited description available...",
  "hasAuction": true,
  "hasLoan": true,
  "equityRange": "High"
}
```

### **Paid User Access**
```json
{
  "id": 123,
  "PStreetNum": "456",
  "PStreetName": "Main St",
  "PCity": "Test City",
  "PState": "TS",
  "PZip": "12345",
  "PCounty": "Test County",
  "PType": "Single Family",
  "PSqFt": "2500",
  "PYearBuilt": "2020",
  "PPrice": 450000,
  "PBeds": "4",
  "PBaths": "3",
  "PFloors": 2,
  "PDescription": "Beautiful single family home with modern amenities...",
  "appraisedAmount": 475000,
  "equity": 25000,
  "equityPercentage": 5.26,
  "hasAuction": true,
  "hasLoan": true,
  "lastUpdated": "2026-02-01T10:00:00Z"
}
```

---

## 🔨 **Auction Features**

### **Free User Access**
```json
{
  "AAuctionID": "***",
  "AAuctionDateTime": "2026-12-**",
  "AAuctionPlace": "*** Auction Hall",
  "AAuctionCity": "Auction City",
  "AAuctionState": "**",
  "AAuctionZip": "*****",
  "AAuctionDescription": "Auction scheduled...",
  "propertyId": 123,
  "propertyType": "Single Family",
  "isUpcoming": true
}
```

### **Paid User Access**
```json
{
  "AAuctionID": 456,
  "AAuctionDateTime": "2026-12-15T10:00:00Z",
  "AAuctionPlace": "County Auction Hall",
  "AAuctionPlaceAddr1": "789 Auction Ave",
  "AAuctionPlaceAddr2": "Suite 500",
  "AAuctionCity": "Auction City",
  "AAuctionState": "FC",
  "AAuctionZip": 12345,
  "AAuctionDescription": "Foreclosure auction for single family property...",
  "propertyId": 123,
  "propertyDetails": {
    "address": "456 Main St, Test City, TS 12345",
    "type": "Single Family",
    "appraisedValue": 475000,
    "startingBid": 250000,
    "estimatedEquity": 225000
  },
  "isUpcoming": true,
  "daysToAuction": 15,
  "registrationRequired": true
}
```

---

## 👤 **Owner Features**

### **Free User Access**
```json
{
  "id": "***",
  "OLastName": "***",
  "OMiddleName": "***",
  "OFirstName": "***",
  "OCity": "***",
  "OState": "**",
  "OZip": "*****",
  "propertyId": 123,
  "propertyType": "Single Family"
}
```

### **Paid User Access**
```json
{
  "id": 789,
  "OLastName": "Smith",
  "OMiddleName": "John",
  "OFirstName": "John",
  "OStreetAddr1": "123 Owner St",
  "OStreetAddr2": "Apt 100",
  "OCity": "Owner City",
  "OState": "OC",
  "OZip": "12345",
  "propertyId": 123,
  "propertyDetails": {
    "address": "456 Main St, Test City, TS 12345",
    "value": 475000
  },
  "contactInfo": {
    "phoneAvailable": true,
    "emailAvailable": true,
    "lastKnownContact": "2026-01-15"
  }
}
```

---

## 💰 **Loan Features**

### **Free User Access**
```json
{
  "id": "***",
  "property_id": 123,
  "deed_id": "***-***",
  "borrower_name": "*** ****",
  "lender_name": "*** Bank",
  "datetime": "20**-**-**",
  "loan_amount": "***,***",
  "propertyType": "Single Family",
  "loanStatus": "Active"
}
```

### **Paid User Access**
```json
{
  "id": 101,
  "property_id": 123,
  "deed_id": "DEED-001",
  "borrower_name": "John Doe",
  "lender_name": "First National Bank",
  "lender_address": "123 Bank St, Financial City, FC 12345",
  "datetime": "2025-06-15T00:00:00Z",
  "loan_amount": 350000,
  "interestRate": 4.5,
  "loanTerm": "30 years",
  "remainingBalance": 325000,
  "propertyDetails": {
    "address": "456 Main St, Test City, TS 12345",
    "appraisedValue": 475000,
    "equity": 150000,
    "loanToValue": 73.68
  },
  "leadScore": 85,
  "contactOpportunity": "High"
}
```

---

## 📊 **New Models Needed**

### **1. User Subscription Model**
```javascript
// models/subscription.js
{
  id: INTEGER,
  userId: INTEGER,
  planType: ENUM('free', 'basic', 'premium', 'enterprise'),
  startDate: DATE,
  endDate: DATE,
  status: ENUM('active', 'expired', 'cancelled'),
  features: JSON,
  apiLimit: INTEGER,
  exportLimit: INTEGER
}
```

### **2. Property Equity Model**
```javascript
// models/property_equity.js
{
  id: INTEGER,
  propertyId: INTEGER,
  appraisedAmount: DECIMAL,
  marketValue: DECIMAL,
  totalLiens: DECIMAL,
  equityAmount: DECIMAL,
  equityPercentage: DECIMAL,
  lastUpdated: DATE,
  updatedBy: INTEGER (admin)
}
```

### **3. Lead Management Model**
```javascript
// models/lead.js
{
  id: INTEGER,
  userId: INTEGER,
  propertyId: INTEGER,
  leadType: ENUM('property', 'auction', 'owner', 'loan'),
  leadScore: INTEGER,
  status: ENUM('new', 'contacted', 'closed', 'lost'),
  notes: TEXT,
  createdAt: DATE,
  contactedAt: DATE
}
```

### **4. User Activity Model**
```javascript
// models/user_activity.js
{
  id: INTEGER,
  userId: INTEGER,
  activityType: ENUM('search', 'view', 'export', 'save'),
  resourceType: ENUM('property', 'auction', 'owner', 'loan'),
  resourceId: INTEGER,
  metadata: JSON,
  createdAt: DATE
}
```

---

## 🚀 **New Public APIs Needed**

### **Property APIs**
```
GET /api/properties                    # Free user (masked)
GET /api/properties/premium           # Paid user (full)
GET /api/properties/search           # Advanced search
GET /api/properties/:id/equity       # Equity information (paid)
GET /api/properties/saved            # Saved properties
POST /api/properties/:id/save        # Save property
```

### **Auction APIs**
```
GET /api/auctions                    # Free user (masked)
GET /api/auctions/premium           # Paid user (full)
GET /api/auctions/upcoming          # Upcoming auctions
GET /api/auctions/calendar          # Auction calendar
GET /api/auctions/:id/property      # Property details for auction
```

### **Owner APIs**
```
GET /api/owners                      # Free user (masked)
GET /api/owners/premium             # Paid user (full)
GET /api/owners/search              # Owner search
GET /api/owners/:id/properties      # Properties by owner
```

### **Loan APIs**
```
GET /api/loans                       # Free user (masked)
GET /api/loans/premium              # Paid user (full)
GET /api/loans/search               # Loan search
GET /api/loans/:id/equity           # Loan equity analysis
```

### **Lead Management APIs**
```
GET /api/leads                       # User's leads
POST /api/leads                      # Create lead
PUT /api/leads/:id                  # Update lead
GET /api/leads/analytics             # Lead analytics
```

### **User Analytics APIs**
```
GET /api/user/profile                # User profile
GET /api/user/subscription          # Subscription info
GET /api/user/activity               # User activity
GET /api/user/saved                  # Saved items
GET /api/user/export                 # Export data
```

---

## 🎯 **Key Features to Implement**

### **1. Data Masking System**
- Automatic data masking for free users
- Configurable masking rules
- Premium data access control

### **2. Lead Generation**
- Property leads with equity information
- Auction leads with upcoming dates
- Owner contact information
- Loan refinance opportunities

### **3. Advanced Search**
- Location-based search
- Price range filters
- Property type filters
- Equity range filters
- Auction date filters

### **4. Analytics Dashboard**
- Property market trends
- Auction success rates
- Equity distribution
- Lead conversion metrics

### **5. Export Features**
- CSV export for premium users
- PDF reports
- Custom data exports
- API access for enterprise users

---

## 🔧 **Implementation Priority**

### **Phase 1: Core Features**
1. User subscription system
2. Data masking middleware
3. Enhanced property APIs
4. Basic auction APIs

### **Phase 2: Lead Management**
1. Lead generation system
2. Owner information APIs
3. Loan information APIs
4. Equity calculation

### **Phase 3: Advanced Features**
1. Analytics dashboard
2. Export capabilities
3. Real-time notifications
4. Advanced search filters

This comprehensive public user system will provide significant value to paid users while maintaining data privacy and creating a sustainable B2B SaaS model!
