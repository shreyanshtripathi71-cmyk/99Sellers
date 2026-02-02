'use strict';

module.exports = (sequelize, DataTypes) => {
  const County = sequelize.define(
    'County',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: { type: DataTypes.STRING(255), allowNull: false },
      index: { type: DataTypes.STRING(3), allowNull: false },
      use: { type: DataTypes.INTEGER, allowNull: false },
      address_template: { type: DataTypes.STRING(255), allowNull: false },
      num_fields: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: 'county',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return County;
};
