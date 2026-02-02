'use strict';

module.exports = (sequelize, DataTypes) => {
  const SitesGroups = sequelize.define(
    'SitesGroups',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING(30), allowNull: false },
    },
    {
      tableName: 'sites_groups',
      freezeTableName: true,
      timestamps: false,
    }
  );
  SitesGroups.associate = function (db) {
    SitesGroups.hasMany(db.Site, { foreignKey: 'group_id' });
  };
  return SitesGroups;
};
