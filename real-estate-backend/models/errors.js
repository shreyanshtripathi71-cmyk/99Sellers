'use strict';

module.exports = (sequelize, DataTypes) => {
  const Errors = sequelize.define(
    'Errors',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      site_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> site
      date_time: { type: DataTypes.DATE, allowNull: false },
      text: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: 'errors',
      freezeTableName: true,
      timestamps: false,
    }
  );
  Errors.associate = function (db) {
    Errors.belongsTo(db.Site, { foreignKey: 'site_id' });
  };
  return Errors;
};
