'use strict';

module.exports = (sequelize, DataTypes) => {
  const Proxy = sequelize.define(
    'Proxy',
    {
      proxy_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      proxy_site_provider: { type: DataTypes.STRING(255), allowNull: false },
      proxy_site_url: { type: DataTypes.STRING(255), allowNull: false },
      proxy_site_port: { type: DataTypes.STRING(255), allowNull: false },
      userid: { type: DataTypes.STRING(50), allowNull: false },
      encryption_id: { type: DataTypes.INTEGER, allowNull: false },
      path_to_password: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: 'proxy',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Proxy;
};
