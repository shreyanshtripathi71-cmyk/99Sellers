'use strict';

module.exports = (sequelize, DataTypes) => {
  const RestartRow = sequelize.define(
    'RestartRow',
    {
      restart_row_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      site_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> site
      county: { type: DataTypes.STRING(255), allowNull: false },
      city: { type: DataTypes.STRING(255), allowNull: false },
      zipcode: { type: DataTypes.STRING(20), allowNull: false },
      data_url: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: 'restart_row',
      freezeTableName: true,
      timestamps: false,
    }
  );
  RestartRow.associate = function (db) {
    RestartRow.belongsTo(db.Site, { foreignKey: 'site_id' });
  };
  return RestartRow;
};
