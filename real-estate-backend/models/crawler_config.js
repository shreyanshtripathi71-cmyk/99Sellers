'use strict';

module.exports = (sequelize, DataTypes) => {
  const CrawlerConfig = sequelize.define(
    'CrawlerConfig',
    {
      site_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      }, // FK -> site
      crawler_name: { type: DataTypes.STRING(255), allowNull: false },
      proxy_yn: { type: DataTypes.CHAR(1), allowNull: false },
      time_delay_yn: { type: DataTypes.CHAR(1), allowNull: false },
      threads_yn: { type: DataTypes.CHAR(1), allowNull: false },
      rotate_proxies_yn: { type: DataTypes.CHAR(1), allowNull: false },
    },
    {
      tableName: 'crawler_config',
      freezeTableName: true,
      timestamps: false,
    }
  );
  CrawlerConfig.associate = function (db) {
    CrawlerConfig.belongsTo(db.Site, { foreignKey: 'site_id' });
  };
  return CrawlerConfig;
};
