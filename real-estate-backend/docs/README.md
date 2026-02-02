# 🏢 Real Estate B2B SaaS Backend API

## 📁 Project Structure

```
backend/
├── 📁 config/                 # Configuration files
│   └── config.json           # Database configuration
├── 📁 controllers/           # Request handlers
│   ├── 📁 admin/            # Admin dashboard controllers
│   │   ├── propertyController.js
│   │   ├── auctionController.js
│   │   ├── ownerController.js
│   │   ├── loanController.js
│   │   ├── userController.js
│   │   ├── crawlerController.js
│   │   └── systemController.js
│   └── 📁 public/           # Public API controllers
│       ├── authController.js
│       ├── propertyController.js
│       ├── auctionController.js
│       └── geoController.js
├── 📁 middleware/            # Custom middleware
│   ├── auth.js              # JWT authentication
│   └── validation.js        # Input validation
├── 📁 models/               # Database models
│   ├── index.js             # Model associations
│   ├── user_login.js
│   ├── property.js
│   ├── auction.js
│   ├── owner.js
│   ├── loan.js
│   ├── eviction.js
│   ├── violation.js
│   └── ... (other models)
├── 📁 routes/               # API routes
│   ├── adminRoutes.js       # Admin-only routes
│   └── publicRoutes.js      # Public routes
├── 📁 uploads/              # File upload directory
├── 📁 utils/                # Utility functions
├── 📄 index.js              # Main application entry point
├── 📄 package.json          # Dependencies and scripts
├── 📄 .env.example          # Environment variables template
└── 📄 README.md             # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL Database
- npm or yarn

### Installation
```bash
npm install
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### Database Setup
```bash
# Create reference data
npm run create-ref-data

# Fix database constraints (if needed)
node fix-database-constraints.js
```

### Start Server
```bash
npm start
```

## 📚 API Documentation

### 🔐 Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration

### 🏠 Properties (Public)
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get property by ID
- `GET /api/nearby` - Search properties by location

### 🎛️ Admin Dashboard (Protected)
- **Properties**: CRUD operations, statistics
- **Auctions**: CRUD operations, upcoming auctions
- **Owners**: CRUD operations, property relationships
- **Loans**: CRUD operations, statistics
- **Users**: CRUD operations, statistics, status management
- **Crawler**: Monitor runs and errors

## 🔑 Security Features
- JWT-based authentication
- Role-based access control (Admin/Public)
- Password hashing with bcrypt
- CORS protection
- Input validation

## 📊 Features
- Complete CRUD operations for all entities
- Bulk data import (CSV)
- Real-time statistics
- Foreign key relationships
- Cascade delete operations
- Professional error handling

## 🧪 Testing
```bash
# Run comprehensive API tests
npm run test-apis

# Test admin CRUD operations
npm run test-admin

# Test specific functionality
node test-comprehensive-admin.js
node api-status-check.js
```

## 🛠️ Development Scripts
```bash
npm start              # Start development server
npm run test-apis       # Run API tests
npm run test-admin      # Run admin tests
npm run create-admin    # Create admin user
npm run create-ref-data # Create reference data
```

## 📝 Notes
- All admin endpoints require JWT authentication
- Foreign key constraints ensure data integrity
- Database schema auto-syncs with models
- File uploads handled with multer
- Comprehensive error logging

## 🎯 Production Ready
This backend is production-ready with:
- ✅ Complete authentication system
- ✅ Full CRUD operations
- ✅ Data validation and security
- ✅ Professional error handling
- ✅ Comprehensive API coverage
- ✅ Database integrity
- ✅ Scalable architecture
