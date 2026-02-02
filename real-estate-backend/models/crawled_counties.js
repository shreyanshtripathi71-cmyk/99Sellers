'use strict';

module.exports = (sequelize, DataTypes) => {
  const CrawledCounties = sequelize.define(
    'CrawledCounties',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      date_time: { type: DataTypes.DATE, allowNull: false },
      site_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> site
    },
    {
      tableName: 'crawled_counties',
      freezeTableName: true,
      timestamps: false,
    }
  );
  CrawledCounties.associate = function (db) {
    CrawledCounties.belongsTo(db.Site, { foreignKey: 'site_id' });
  };
  return CrawledCounties;
};
