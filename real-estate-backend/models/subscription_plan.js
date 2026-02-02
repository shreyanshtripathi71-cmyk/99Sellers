'use strict';

module.exports = (sequelize, DataTypes) => {
  const SubscriptionPlan = sequelize.define(
    'SubscriptionPlan',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      stripePriceId: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Stripe price ID for this plan'
      },
      stripeProductId: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Stripe product ID for this plan'
      },
      type: {
        type: DataTypes.ENUM('basic', 'premium', 'enterprise'),
        allowNull: false
      },
      billingCycle: {
        type: DataTypes.ENUM('monthly', 'yearly'),
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Price in cents'
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      features: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}
      },
      limits: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
          searchLimit: 50,
          exportLimit: 100,
          apiCallsPerDay: 100,
          propertiesPerSearch: 20,
          leadsPerMonth: 50,
          storageMB: 100
        }
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      trialDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of trial days for this plan'
      },
      sortOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Order for displaying plans'
      },
      popular: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Highlight as popular plan'
      }
    },
    {
      tableName: 'subscription_plan',
      freezeTableName: true,
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  );

  SubscriptionPlan.associate = function (db) {
    // SubscriptionPlan.hasMany(db.Subscription, { foreignKey: 'planId' });
  };

  // Class methods
  SubscriptionPlan.getActivePlans = async function() {
    return await this.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['price', 'ASC']]
    });
  };

  SubscriptionPlan.getPlanByStripePriceId = async function(stripePriceId) {
    return await this.findOne({
      where: { stripePriceId, isActive: true }
    });
  };

  SubscriptionPlan.getPlansByType = async function(type) {
    return await this.findAll({
      where: { type, isActive: true },
      order: [['sortOrder', 'ASC'], ['price', 'ASC']]
    });
  };

  return SubscriptionPlan;
};
