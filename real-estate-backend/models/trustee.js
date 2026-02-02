'use strict';

module.exports = (sequelize, DataTypes) => {
  const Trustee = sequelize.define(
    'Trustee',
    {
      TTrusteeID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      TTrusteeName: { type: DataTypes.TEXT, allowNull: false }, // LONGTEXT
      TTrusteeAddress: { type: DataTypes.TEXT, allowNull: false }, // LONGTEXT
      TTRUSTEECity: { type: DataTypes.STRING(30), allowNull: false },
      TTRUSTEEState: { type: DataTypes.CHAR(2), allowNull: false },
      TTRUSTEEZip: { type: DataTypes.INTEGER, allowNull: false },
      TTrusteePhone: { type: DataTypes.STRING(20), allowNull: false },
      TTrusteeEmail: { type: DataTypes.STRING(100), allowNull: false },
      TTrusteeWebSite: { type: DataTypes.STRING(100), allowNull: false },
      type: { type: DataTypes.STRING(100), allowNull: false },
    },
    {
      tableName: 'trustee',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Trustee;
};
