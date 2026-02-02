'use strict';

module.exports = (sequelize, DataTypes) => {
  const MotiveTypes = sequelize.define(
    'MotiveTypes',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: { type: DataTypes.STRING(3), allowNull: false },
      name: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: 'motive_types',
      freezeTableName: true,
      timestamps: false,
    }
  );
  MotiveTypes.associate = function (db) {
    MotiveTypes.hasMany(db.Property, { foreignKey: 'motive_type_id' });
    MotiveTypes.hasMany(db.FilesUrls, { foreignKey: 'motive_type_id' });
    MotiveTypes.hasMany(db.PagesUrls, { foreignKey: 'motive_type_id' });
  };
  return MotiveTypes;
};
