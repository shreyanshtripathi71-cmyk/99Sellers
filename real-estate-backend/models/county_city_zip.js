'use strict';

module.exports = (sequelize, DataTypes) => {
  const CountyCityZip = sequelize.define(
    'CountyCityZip',
    {
      county: { type: DataTypes.STRING(255), allowNull: false },
      city: { type: DataTypes.STRING(255), allowNull: false },
      zip: { type: DataTypes.STRING(20), allowNull: false },
    },
    {
      tableName: 'county_city_zip',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return CountyCityZip;
};
