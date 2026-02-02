'use strict';

module.exports = (sequelize, DataTypes) => {
  const OwnerNamePattern = sequelize.define(
    'OwnerNamePattern',
    {
      pattern_level: { type: DataTypes.INTEGER, allowNull: false },
      owner_name_pattern: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: 'owner_name_pattern',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return OwnerNamePattern;
};
