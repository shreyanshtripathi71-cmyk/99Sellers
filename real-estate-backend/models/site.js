'use strict';

module.exports = (sequelize, DataTypes) => {
  const Site = sequelize.define(
    'Site',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      group_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> sites_groups
      url: { type: DataTypes.STRING(255), allowNull: false },
      module: { type: DataTypes.STRING(100), allowNull: false },
      owner_format: { type: DataTypes.STRING(255), allowNull: false },
      property_format: { type: DataTypes.STRING(255), allowNull: false },
      tables_to_use: { type: DataTypes.STRING(255), allowNull: false },
      last_run: { type: DataTypes.DATE, allowNull: false },
      priority: { type: DataTypes.MEDIUMINT, allowNull: false },
      crawler_name: { type: DataTypes.STRING(100), allowNull: false },
    },
    {
      tableName: 'site',
      freezeTableName: true,
      timestamps: false,
    }
  );
  Site.associate = function (db) {
    Site.belongsTo(db.SitesGroups, { foreignKey: 'group_id' });
    Site.hasMany(db.CrawledCounties, { foreignKey: 'site_id' });
    Site.hasMany(db.CrawlerConfig, { foreignKey: 'site_id' });
    Site.hasMany(db.CrawlerLogAll, { foreignKey: 'site_id' });
    Site.hasMany(db.Errors, { foreignKey: 'site_id' });
    Site.hasMany(db.FilesUrls, { foreignKey: 'site_id' });
    Site.hasMany(db.PagesUrls, { foreignKey: 'site_id' });
    Site.hasMany(db.Proaddress, { foreignKey: 'site_id' });
    Site.hasMany(db.RestartRow, { foreignKey: 'site_id' });
    Site.hasMany(db.RunDates, { foreignKey: 'site_id' });
    Site.hasMany(db.TimeDelay, { foreignKey: 'site_id' });
  };
  return Site;
};
