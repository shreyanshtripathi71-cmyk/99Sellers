'use strict';

module.exports = (sequelize, DataTypes) => {
  const CityCounty = sequelize.define(
    'CityCounty',
    {
      city: { type: DataTypes.STRING(255), allowNull: false },
      county: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: 'city_county',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return CityCounty;
};
