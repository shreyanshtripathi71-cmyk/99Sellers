'use strict';

module.exports = (sequelize, DataTypes) => {
  const PropertySkip = sequelize.define(
    'PropertySkip',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING(255), allowNull: false },
      PStreetNum: { type: DataTypes.STRING(255), allowNull: false },
      PStreetName: { type: DataTypes.STRING(255), allowNull: false },
      Pzip: { type: DataTypes.STRING(10), allowNull: false },
      skip: { type: DataTypes.INTEGER, allowNull: false },
      type: { type: DataTypes.CHAR(3), allowNull: false },
      Pcity: { type: DataTypes.STRING(255), allowNull: false },
      PState: { type: DataTypes.STRING(20), allowNull: false },
      counties: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: 'property_skip',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return PropertySkip;
};
