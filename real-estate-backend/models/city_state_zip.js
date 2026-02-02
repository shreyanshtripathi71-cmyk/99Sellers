'use strict';

module.exports = (sequelize, DataTypes) => {
  const CityStateZip = sequelize.define(
    'CityStateZip',
    {
      city: { type: DataTypes.STRING(255), allowNull: false },
      state: { type: DataTypes.STRING(255), allowNull: false },
      zip: { type: DataTypes.STRING(20), allowNull: false },
    },
    {
      tableName: 'city_state_zip',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return CityStateZip;
};
