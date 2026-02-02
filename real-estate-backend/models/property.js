'use strict';

module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define(
    'Property',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false, // [cite: 41]
      },
      PStreetNum: { type: DataTypes.STRING(255), allowNull: false }, // [cite: 42, 92]
      PStreetName: { type: DataTypes.STRING(255), allowNull: false }, // [cite: 42, 93]
      PCity: { type: DataTypes.STRING(255), allowNull: false }, // [cite: 96]
      PState: { type: DataTypes.STRING(255), allowNull: false }, // [cite: 97]
      PZip: { type: DataTypes.STRING(20), allowNull: false }, // [cite: 93, 97]
      PCounty: { type: DataTypes.STRING(255), allowNull: false }, // [cite: 44, 98]
      PType: { type: DataTypes.STRING(100), allowNull: false }, // [cite: 49]
      PSqFt: { type: DataTypes.STRING(20), allowNull: false },
      PYearBuilt: { type: DataTypes.STRING(20), allowNull: false }, // [cite: 56]
      PPrice: { type: DataTypes.DOUBLE, allowNull: false },
      PBeds: { type: DataTypes.STRING(10), allowNull: false },
      PBaths: { type: DataTypes.STRING(10), allowNull: false },
      PFloors: { type: DataTypes.DOUBLE, allowNull: false },
      PDescription: { type: DataTypes.TEXT, allowNull: false },
      proaddress_id: { type: DataTypes.INTEGER, allowNull: true }, // [cite: 58]
      motive_type_id: { type: DataTypes.INTEGER, allowNull: true }, // [cite: 59]
      PFilesUrlsId: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: 'property', // [cite: 40]
      freezeTableName: true,
      timestamps: false,
    }
  );

  Property.associate = function (db) {
    // Relationships based on foreign keys in EER
    Property.hasMany(db.Auction, { foreignKey: 'APropertyID', onDelete: 'CASCADE' }); 
    Property.hasMany(db.Loan, { foreignKey: 'property_id', onDelete: 'CASCADE' }); 
    Property.hasMany(db.Owner, { foreignKey: 'OProperty_id', onDelete: 'CASCADE' }); 
    Property.hasMany(db.Eviction, { foreignKey: 'property_id', onDelete: 'CASCADE' }); 
    Property.hasMany(db.Violation, { foreignKey: 'property_id', onDelete: 'CASCADE' });
    
    Property.belongsTo(db.Proaddress, { foreignKey: 'proaddress_id', onDelete: 'SET NULL' }); 
    Property.belongsTo(db.MotiveTypes, { foreignKey: 'motive_type_id', onDelete: 'SET NULL' }); 
    Property.belongsTo(db.FilesUrls, { foreignKey: 'PFilesUrlsId', onDelete: 'SET NULL' });
    
    // New associations for premium features (commented out temporarily)
    // Property.hasOne(db.PropertyEquity, { foreignKey: 'propertyId', as: 'equity' });
    // Property.hasMany(db.Lead, { foreignKey: 'propertyId', as: 'leads' });
    // Property.hasMany(db.UserActivity, { foreignKey: 'resourceId', where: { resourceType: 'property' } });
  };

  return Property;
};