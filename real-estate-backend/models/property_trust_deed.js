'use strict';

module.exports = (sequelize, DataTypes) => {
  const PropertyTrustDeed = sequelize.define(
    'PropertyTrustDeed',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      deed_id: { type: DataTypes.STRING(10), allowNull: false },
      county: { type: DataTypes.STRING(50), allowNull: false },
      property_address: { type: DataTypes.TEXT, allowNull: false },
      owner_name: { type: DataTypes.STRING(50), allowNull: false },
      borrower_name: { type: DataTypes.STRING(50), allowNull: false },
      lender_name: { type: DataTypes.STRING(50), allowNull: false },
      lender_address: { type: DataTypes.TEXT, allowNull: false },
      trustee_name: { type: DataTypes.STRING(50), allowNull: false },
      trustee_address: { type: DataTypes.TEXT, allowNull: false },
      property_id: { type: DataTypes.STRING(200), allowNull: false },
      datetime: { type: DataTypes.DATE, allowNull: false },
      loan_amount: { type: DataTypes.STRING(20), allowNull: false },
    },
    {
      tableName: 'property_trust_deed',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return PropertyTrustDeed;
};
