'use strict';

module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    'Request',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      RS_Num: { type: DataTypes.STRING(50), allowNull: false },
      streetNum: { type: DataTypes.INTEGER, allowNull: false },
      streetName: { type: DataTypes.STRING(255), allowNull: false },
      locDescription: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: 'request',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Request;
};
