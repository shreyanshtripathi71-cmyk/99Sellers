'use strict';

module.exports = (sequelize, DataTypes) => {
  const TrusteeAddressPattern = sequelize.define(
    'TrusteeAddressPattern',
    {
      pattern_level: { type: DataTypes.INTEGER, allowNull: false },
      trustee_address_pattern: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: 'trustee_address_pattern',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return TrusteeAddressPattern;
};
