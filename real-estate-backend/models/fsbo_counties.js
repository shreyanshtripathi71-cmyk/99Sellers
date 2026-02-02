'use strict';

module.exports = (sequelize, DataTypes) => {
  const FsboCounties = sequelize.define(
    'FsboCounties',
    {
      county: { type: DataTypes.STRING(10), allowNull: false },
      date_time: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: 'fsbo_counties',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return FsboCounties;
};
