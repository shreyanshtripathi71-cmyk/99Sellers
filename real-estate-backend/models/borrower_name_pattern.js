'use strict';

module.exports = (sequelize, DataTypes) => {
  const BorrowerNamePattern = sequelize.define(
    'BorrowerNamePattern',
    {
      pattern_level: { type: DataTypes.INTEGER, allowNull: false },
      borrower_name_pattern: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: 'borrower_name_pattern',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return BorrowerNamePattern;
};
