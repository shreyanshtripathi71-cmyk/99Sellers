'use strict';

module.exports = (sequelize, DataTypes) => {
  const ZipCitySt = sequelize.define(
    'ZipCitySt',
    {
      zip: { type: DataTypes.STRING(20), allowNull: false },
      county: { type: DataTypes.STRING(255), allowNull: false },
      state: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: 'zip_city_st',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return ZipCitySt;
};
