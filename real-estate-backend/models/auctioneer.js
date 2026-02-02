'use strict';

module.exports = (sequelize, DataTypes) => {
  const Auctioneer = sequelize.define(
    'Auctioneer',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING(255), allowNull: false },
      address: { type: DataTypes.STRING(255), allowNull: false },
      phone: { type: DataTypes.STRING(100), allowNull: false },
      email: { type: DataTypes.STRING(100), allowNull: false },
      web_site: { type: DataTypes.STRING(100), allowNull: false },
      html: { type: DataTypes.TEXT, allowNull: false },
      type: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: 'auctioneer',
      freezeTableName: true,
      timestamps: false,
    }
  );
  Auctioneer.associate = function (db) {
    Auctioneer.hasMany(db.Property, { foreignKey: 'auctioneer_id' });
    Auctioneer.hasMany(db.PagesUrls, { foreignKey: 'auctioneer_id' });
  };
  return Auctioneer;
};
