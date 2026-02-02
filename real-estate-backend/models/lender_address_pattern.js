'use strict';

module.exports = (sequelize, DataTypes) => {
  const LenderAddressPattern = sequelize.define(
    'LenderAddressPattern',
    {
      pattern_level: { type: DataTypes.INTEGER, allowNull: false },
      lender_address_pattern: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: 'lender_address_pattern',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return LenderAddressPattern;
};
