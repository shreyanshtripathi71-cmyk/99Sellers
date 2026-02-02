const db = require('../../models');
const { Property, Auction, Owner, Loan } = db;

/**
 * Premium Controller - Handles premium feature endpoints
 * These endpoints provide enhanced data access for premium subscribers
 */

// Get properties with equity information
exports.getPropertiesWithEquity = async (req, res) => {
  try {
    const { limit = 50, offset = 0, minEquity = 0 } = req.query;

    // Check if user has premium access
    if (!req.userSubscription || req.userSubscription.planType === 'free') {
      return res.status(403).json({
        error: 'Premium subscription required',
        message: 'This feature requires a premium subscription'
      });
    }

    const properties = await Property.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      where: {
        // Add equity filter logic here based on your data structure
        // This is a placeholder - adjust to your actual database schema
      },
      include: [
        { model: Owner, as: 'owners' },
        { model: Loan, as: 'loans' }
      ]
    });

    res.json({
      success: true,
      data: properties,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: properties.length
      }
    });
  } catch (error) {
    console.error('Error fetching properties with equity:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to fetch properties with equity'
    });
  }
};

// Get auction leads for premium users
exports.getAuctionLeads = async (req, res) => {
  try {
    const { limit = 50, offset = 0, status = 'active' } = req.query;

    // Check if user has premium access
    if (!req.userSubscription || req.userSubscription.planType === 'free') {
      return res.status(403).json({
        error: 'Premium subscription required',
        message: 'This feature requires a premium subscription'
      });
    }

    const auctions = await Auction.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      where: status !== 'all' ? { status } : {},
      include: [
        { model: Property, as: 'property' }
      ],
      order: [['auctionDate', 'ASC']]
    });

    res.json({
      success: true,
      data: auctions,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: auctions.length
      }
    });
  } catch (error) {
    console.error('Error fetching auction leads:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to fetch auction leads'
    });
  }
};

// Get owner leads for premium users
exports.getOwnerLeads = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    // Check if user has premium access
    if (!req.userSubscription || req.userSubscription.planType === 'free') {
      return res.status(403).json({
        error: 'Premium subscription required',
        message: 'This feature requires a premium subscription'
      });
    }

    const owners = await Owner.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: Property, as: 'properties' }
      ]
    });

    res.json({
      success: true,
      data: owners,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: owners.length
      }
    });
  } catch (error) {
    console.error('Error fetching owner leads:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to fetch owner leads'
    });
  }
};

// Get loan leads for premium users
exports.getLoanLeads = async (req, res) => {
  try {
    const { limit = 50, offset = 0, minAmount = 0 } = req.query;

    // Check if user has premium access
    if (!req.userSubscription || req.userSubscription.planType === 'free') {
      return res.status(403).json({
        error: 'Premium subscription required',
        message: 'This feature requires a premium subscription'
      });
    }

    const loans = await Loan.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      where: minAmount > 0 ? {
        // Add loan amount filter based on your schema
      } : {},
      include: [
        { model: Property, as: 'property' }
      ]
    });

    res.json({
      success: true,
      data: loans,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: loans.length
      }
    });
  } catch (error) {
    console.error('Error fetching loan leads:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to fetch loan leads'
    });
  }
};
