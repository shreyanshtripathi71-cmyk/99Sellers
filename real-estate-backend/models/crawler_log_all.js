'use strict';

module.exports = (sequelize, DataTypes) => {
  const CrawlerLogAll = sequelize.define(
    'CrawlerLogAll',
    {
      crawler_log_all_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      site_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> site
      county: { type: DataTypes.STRING(255), allowNull: false },
      city: { type: DataTypes.STRING(255), allowNull: false },
      zipcode: { type: DataTypes.STRING(20), allowNull: false },
      firstname: { type: DataTypes.STRING(255), allowNull: false },
      middlename: { type: DataTypes.STRING(255), allowNull: false },
      lastname: { type: DataTypes.STRING(255), allowNull: false },
      streetnum: { type: DataTypes.STRING(255), allowNull: false },
      streetname: { type: DataTypes.STRING(255), allowNull: false },
      addressline2: { type: DataTypes.STRING(255), allowNull: false },
      data_url: { type: DataTypes.STRING(255), allowNull: false },
      text_dump: { type: DataTypes.TEXT, allowNull: false },
      failed_yn: { type: DataTypes.CHAR(1), allowNull: false },
    },
    {
      tableName: 'crawler_log_all',
      freezeTableName: true,
      timestamps: false,
    }
  );
  CrawlerLogAll.associate = function (db) {
    CrawlerLogAll.belongsTo(db.Site, { foreignKey: 'site_id' });
  };
  return CrawlerLogAll;
};
