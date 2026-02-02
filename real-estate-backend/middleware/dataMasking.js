const db = require('../models');

/**
 * Data Masking Middleware
 * Masks sensitive data for free users while showing full data to paid users
 */

const maskPropertyData = (property, userSubscription) => {
  if (!property) return property;
  
  const isPaidUser = userSubscription?.planType !== 'free';
  
  if (isPaidUser) {
    return property;
  }
  
  // Mask data for free users
  const masked = { ...property };
  
  // Mask address details
  if (masked.PStreetNum) masked.PStreetNum = "***";
  if (masked.PZip) masked.PZip = masked.PZip.substring(0, 2) + "***";
  
  // Mask financial information
  if (masked.PPrice) masked.PPrice = "***,***";
  if (masked.PSqFt) masked.PSqFt = masked.PSqFt.substring(0, 1) + "***";
  if (masked.PYearBuilt) masked.PYearBuilt = "20**";
  if (masked.PBeds) masked.PBeds = "*";
  if (masked.PBaths) masked.PBaths = "*";
  if (masked.PFloors) masked.PFloors = "*";
  
  // Mask description
  if (masked.PDescription) {
    masked.PDescription = "Limited description available. Upgrade to premium for full details.";
  }
  
  // Add lead generation hints
  masked.hasAuction = true;
  masked.hasLoan = true;
  masked.equityRange = calculateEquityRange(property);
  masked.leadScore = Math.floor(Math.random() * 30) + 60; // 60-90 range
  
  return masked;
};

const maskAuctionData = (auction, userSubscription) => {
  if (!auction) return auction;
  
  const isPaidUser = userSubscription?.planType !== 'free';
  
  if (isPaidUser) {
    return auction;
  }
  
  // Mask auction data for free users
  const masked = { ...auction };
  
  // Mask auction details
  if (masked.AAuctionID) masked.AAuctionID = "***";
  if (masked.AAuctionDateTime) {
    const date = new Date(masked.AAuctionDateTime);
    masked.AAuctionDateTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-**`;
  }
  if (masked.AAuctionPlace) masked.AAuctionPlace = "*** Auction Hall";
  if (masked.AAuctionState) masked.AAuctionState = "**";
  if (masked.AAuctionZip) masked.AAuctionZip = "*****";
  
  // Mask description
  if (masked.AAuctionDescription) {
    masked.AAuctionDescription = "Auction scheduled. Upgrade to premium for full details.";
  }
  
  return masked;
};

const maskOwnerData = (owner, userSubscription) => {
  if (!owner) return owner;
  
  const isPaidUser = userSubscription?.planType !== 'free';
  
  if (isPaidUser) {
    return owner;
  }
  
  // Mask owner data for free users
  const masked = { ...owner };
  
  // Mask personal information
  if (masked.OLastName) masked.OLastName = "***";
  if (masked.OMiddleName) masked.OMiddleName = "***";
  if (masked.OFirstName) masked.OFirstName = "***";
  if (masked.OCity) masked.OCity = "***";
  if (masked.OState) masked.OState = "**";
  if (masked.OZip) masked.OZip = "*****";
  
  return masked;
};

const maskLoanData = (loan, userSubscription) => {
  if (!loan) return loan;
  
  const isPaidUser = userSubscription?.planType !== 'free';
  
  if (isPaidUser) {
    return loan;
  }
  
  // Mask loan data for free users
  const masked = { ...loan };
  
  // Mask sensitive information
  if (masked.id) masked.id = "***";
  if (masked.deed_id) masked.deed_id = "***-***";
  if (masked.borrower_name) {
    const parts = masked.borrower_name.split(' ');
    masked.borrower_name = parts[0] + " ****";
  }
  if (masked.lender_name) masked.lender_name = "*** Bank";
  if (masked.datetime) {
    const date = new Date(masked.datetime);
    masked.datetime = `${date.getFullYear()}-**-**`;
  }
  if (masked.loan_amount) masked.loan_amount = "***,***";
  
  return masked;
};

const calculateEquityRange = (property) => {
  // Simple equity range calculation for free users
  if (!property.PPrice) return "Unknown";
  
  const price = property.PPrice;
  if (price < 100000) return "Low";
  if (price < 300000) return "Medium";
  if (price < 500000) return "High";
  return "Very High";
};

const maskArrayData = (dataArray, userSubscription, maskFunction) => {
  if (!Array.isArray(dataArray)) return dataArray;
  
  return dataArray.map(item => maskFunction(item, userSubscription));
};

/**
 * Main middleware function to apply data masking
 */
const applyDataMasking = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Get user subscription from request (should be attached by auth middleware)
    const userSubscription = req.userSubscription;
    
    if (!userSubscription || userSubscription.planType === 'free') {
      // Apply masking to different data types
      if (data && typeof data === 'object') {
        // Handle single property
        if (data.PStreetNum || data.id && data.PType) {
          data = maskPropertyData(data, userSubscription);
        }
        // Handle array of properties
        else if (Array.isArray(data) && data.length > 0 && data[0].PStreetNum) {
          data = maskArrayData(data, userSubscription, maskPropertyData);
        }
        // Handle single auction
        else if (data.AAuctionID) {
          data = maskAuctionData(data, userSubscription);
        }
        // Handle array of auctions
        else if (Array.isArray(data) && data.length > 0 && data[0].AAuctionID) {
          data = maskArrayData(data, userSubscription, maskAuctionData);
        }
        // Handle single owner
        else if (data.OLastName) {
          data = maskOwnerData(data, userSubscription);
        }
        // Handle array of owners
        else if (Array.isArray(data) && data.length > 0 && data[0].OLastName) {
          data = maskArrayData(data, userSubscription, maskOwnerData);
        }
        // Handle single loan
        else if (data.deed_id) {
          data = maskLoanData(data, userSubscription);
        }
        // Handle array of loans
        else if (Array.isArray(data) && data.length > 0 && data[0].deed_id) {
          data = maskArrayData(data, userSubscription, maskLoanData);
        }
      }
    }
    
    originalJson.call(this, data);
  };
  
  next();
};

/**
 * Middleware to attach user subscription to request
 */
const attachUserSubscription = async (req, res, next) => {
  try {
    if (req.user && req.user.id) {
      const subscription = await db.Subscription.findOne({
        where: {
          userId: req.user.id,
          status: 'active'
        },
        order: [['createdAt', 'DESC']]
      });
      
      req.userSubscription = subscription;
    }
    
    next();
  } catch (error) {
    console.error('Error attaching user subscription:', error);
    next();
  }
};

module.exports = {
  applyDataMasking,
  attachUserSubscription,
  maskPropertyData,
  maskAuctionData,
  maskOwnerData,
  maskLoanData
};
