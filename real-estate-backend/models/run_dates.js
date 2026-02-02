'use strict';

module.exports = (sequelize, DataTypes) => {
  const RunDates = sequelize.define(
    'RunDates',
    {
      site_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      }, // FK -> site
      min_run_dt: { type: DataTypes.DATEONLY, allowNull: false },
      max_run_dt: { type: DataTypes.DATEONLY, allowNull: false },
    },
    {
      tableName: 'run_dates',
      freezeTableName: true,
      timestamps: false,
    }
  );
  RunDates.associate = function (db) {
    RunDates.belongsTo(db.Site, { foreignKey: 'site_id' });
  };
  return RunDates;
};
