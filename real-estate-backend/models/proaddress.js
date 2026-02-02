'use strict';

module.exports = (sequelize, DataTypes) => {
  const Proaddress = sequelize.define(
    'Proaddress',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      listing_id: { type: DataTypes.STRING(255), allowNull: false },
      PStreetNum: { type: DataTypes.STRING(10), allowNull: false },
      backup_street_name: { type: DataTypes.STRING(255), allowNull: false },
      PStreetName: { type: DataTypes.STRING(100), allowNull: false },
      PSuiteNum: { type: DataTypes.STRING(255), allowNull: false },
      Pcity: { type: DataTypes.STRING(255), allowNull: false },
      PState: { type: DataTypes.STRING(10), allowNull: false },
      Pzip: { type: DataTypes.STRING(10), allowNull: false },
      word: { type: DataTypes.STRING(50), allowNull: false },
      abbreviation: { type: DataTypes.STRING(20), allowNull: false },
      owner_name: { type: DataTypes.STRING(255), allowNull: false },
      PMotiveType: { type: DataTypes.CHAR(3), allowNull: false },
      counties: { type: DataTypes.STRING(255), allowNull: false },
      price: { type: DataTypes.DOUBLE(20, 4), allowNull: false },
      url: { type: DataTypes.STRING(255), allowNull: false },
      beds: { type: DataTypes.STRING(10), allowNull: false },
      baths: { type: DataTypes.STRING(10), allowNull: false },
      proptype: { type: DataTypes.STRING(255), allowNull: false },
      square_feet: { type: DataTypes.INTEGER, allowNull: false },
      PYearBuilt: { type: DataTypes.STRING(10), allowNull: false },
      floors: { type: DataTypes.DOUBLE, allowNull: false },
      school_district: { type: DataTypes.STRING(255), allowNull: false },
      garage_size: { type: DataTypes.DOUBLE, allowNull: false },
      lot_size: { type: DataTypes.STRING(30), allowNull: false },
      amenities: { type: DataTypes.TEXT, allowNull: false },
      comments: { type: DataTypes.TEXT, allowNull: false },
      owner_phone: { type: DataTypes.STRING(255), allowNull: false },
      site_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> site
      DATE_TIMEOFEXTRACTION: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: 'proaddress',
      freezeTableName: true,
      timestamps: false,
    }
  );
  Proaddress.associate = function (db) {
    Proaddress.belongsTo(db.Site, { foreignKey: 'site_id' });
    Proaddress.hasMany(db.Property, { foreignKey: 'proaddress_id' });
    Proaddress.hasMany(db.ErroneousLinks, { foreignKey: 'proaddress_id' });
    Proaddress.hasMany(db.FilesUrls, { foreignKey: 'proaddress_id' });
  };
  return Proaddress;
};
