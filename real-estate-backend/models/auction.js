'use strict';

module.exports = (sequelize, DataTypes) => {
  const Auction = sequelize.define(
    'Auction',
    {
      AAuctionID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      AAuctionDateTime: { type: DataTypes.DATE, allowNull: false },
      AAuctionPlace: { type: DataTypes.STRING(255), allowNull: false },
      AAuctionPlaceAddr1: { type: DataTypes.STRING(255), allowNull: false },
      AAuctionPlaceAddr2: { type: DataTypes.STRING(100), allowNull: false },
      AAuctionCity: { type: DataTypes.STRING(30), allowNull: false },
      AAuctionState: { type: DataTypes.CHAR(2), allowNull: false },
      AAuctionZip: { type: DataTypes.INTEGER, allowNull: false },
      AAuctionDescription: { type: DataTypes.TEXT, allowNull: false },
      APropertyID: { type: DataTypes.INTEGER, allowNull: true }, // FK -> property
    },
    {
      tableName: 'auction',
      freezeTableName: true,
      timestamps: false,
    }
  );
  Auction.associate = function (db) {
    Auction.belongsTo(db.Property, { foreignKey: 'APropertyID', onDelete: 'SET NULL' });
  };
  return Auction;
};
