'use strict';

module.exports = (sequelize, DataTypes) => {
  const LenderNamePattern = sequelize.define(
    'LenderNamePattern',
    {
      pattern_level: { type: DataTypes.INTEGER, allowNull: false },
      lender_name_pattern: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: 'lender_name_pattern',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return LenderNamePattern;
};
