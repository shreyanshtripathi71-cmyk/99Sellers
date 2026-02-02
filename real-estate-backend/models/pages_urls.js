'use strict';

module.exports = (sequelize, DataTypes) => {
  const PagesUrls = sequelize.define(
    'PagesUrls',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      url: { type: DataTypes.STRING(900), allowNull: false },
      county: { type: DataTypes.STRING(255), allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false }, // MEDIUMTEXT
      parsed: { type: DataTypes.INTEGER, allowNull: false },
      address: { type: DataTypes.STRING(255), allowNull: false },
      owner: { type: DataTypes.TEXT, allowNull: false },
      auctioneer: { type: DataTypes.TEXT, allowNull: false },
      auction: { type: DataTypes.TEXT, allowNull: false },
      site_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> site
      extract_date: { type: DataTypes.DATEONLY, allowNull: false },
      keyword: { type: DataTypes.STRING(255), allowNull: false },
      auctioneer_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> auctioneer
      listing_id: { type: DataTypes.STRING(255), allowNull: false },
      download_date: { type: DataTypes.DATE, allowNull: false },
      parser_status: { type: DataTypes.STRING(255), allowNull: false },
      crawler_status: { type: DataTypes.STRING(255), allowNull: false },
      ad_number: { type: DataTypes.INTEGER, allowNull: false },
      motive_type_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> motive_types
    },
    {
      tableName: 'pages_urls',
      freezeTableName: true,
      timestamps: false,
    }
  );
  PagesUrls.associate = function (db) {
    PagesUrls.belongsTo(db.Site, { foreignKey: 'site_id' });
    PagesUrls.belongsTo(db.Auctioneer, { foreignKey: 'auctioneer_id' });
    PagesUrls.belongsTo(db.MotiveTypes, { foreignKey: 'motive_type_id' });
  };
  return PagesUrls;
};
