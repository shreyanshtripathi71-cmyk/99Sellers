'use strict';

module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define(
    'Report',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      date: { type: DataTypes.DATEONLY, allowNull: false },
    },
    {
      tableName: 'report',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Report;
};
