'use strict';

module.exports = (sequelize, DataTypes) => {
  const FilesUrls = sequelize.define(
    'FilesUrls',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      url: { type: DataTypes.STRING(255), allowNull: false },
      contents: { type: DataTypes.TEXT, allowNull: false },
      property_card: { type: DataTypes.TEXT, allowNull: false },
      parsed: { type: DataTypes.INTEGER, allowNull: false },
      site_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> site
      county_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> county
      html_md5: { type: DataTypes.STRING(255), allowNull: false },
      proaddress_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> proaddress
      ownername_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> ownername
      motive_type_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> motive_types
      PMotiveType: { type: DataTypes.CHAR(3), allowNull: false },
    },
    {
      tableName: 'files_urls',
      freezeTableName: true,
      timestamps: false,
    }
  );
  FilesUrls.associate = function (db) {
    FilesUrls.belongsTo(db.Site, { foreignKey: 'site_id' });
    FilesUrls.belongsTo(db.County, { foreignKey: 'county_id' });
    FilesUrls.belongsTo(db.Proaddress, { foreignKey: 'proaddress_id' });
    FilesUrls.belongsTo(db.Ownername, { foreignKey: 'ownername_id' });
    FilesUrls.belongsTo(db.MotiveTypes, { foreignKey: 'motive_type_id' });
    FilesUrls.hasMany(db.Property, { foreignKey: 'PFilesUrlsId' });
  };
  return FilesUrls;
};
