'use strict';

module.exports = (sequelize, DataTypes) => {
  const TimeDelay = sequelize.define(
    'TimeDelay',
    {
      site_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      }, // FK -> site
      delay_min_secs: { type: DataTypes.INTEGER, allowNull: false },
      delay_max_secs: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: 'time_delay',
      freezeTableName: true,
      timestamps: false,
    }
  );
  TimeDelay.associate = function (db) {
    TimeDelay.belongsTo(db.Site, { foreignKey: 'site_id' });
  };
  return TimeDelay;
};
