'use strict';

module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    'Subscription',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_login',
          key: 'id'
        }
      },
      planType: {
        type: DataTypes.ENUM('free', 'basic', 'premium', 'enterprise'),
        allowNull: false,
        defaultValue: 'free'
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('active', 'expired', 'cancelled', 'suspended'),
        allowNull: false,
        defaultValue: 'active'
      },
      features: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
          searchLimit: 50,
          exportLimit: 100,
          apiCallsPerDay: 100,
          advancedSearch: false,
          fullDataAccess: false,
          exportEnabled: false,
          leadGeneration: false,
          realTimeAlerts: false
        }
      },
      apiLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      exportLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      billingCycle: {
        type: DataTypes.ENUM('monthly', 'yearly'),
        allowNull: false,
        defaultValue: 'monthly'
      },
      autoRenew: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      lastPaymentDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      nextBillingDate: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'subscription',
      freezeTableName: true,
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt'
    }
  );

  Subscription.associate = function (db) {
    Subscription.belongsTo(db.UserLogin, { foreignKey: 'userId' });
    // UserActivity model doesn't exist - removed association
  };

  return Subscription;
};
