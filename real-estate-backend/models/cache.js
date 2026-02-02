'use strict';

module.exports = (sequelize, DataTypes) => {
  const Cache = sequelize.define(
    'Cache',
    {
      key: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false,
      },
      value: { type: DataTypes.TEXT, allowNull: false }, // LONGTEXT in MySQL
    },
    {
      tableName: 'cache',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Cache;
};
