'use strict';

module.exports = (sequelize, DataTypes) => {
  const PropertyAddressPattern = sequelize.define(
    'PropertyAddressPattern',
    {
      pattern_level: { type: DataTypes.INTEGER, allowNull: false },
      property_address_pattern: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: 'property_address_pattern',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return PropertyAddressPattern;
};
