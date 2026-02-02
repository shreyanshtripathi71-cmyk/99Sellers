'use strict';

module.exports = (sequelize, DataTypes) => {
  const Violation = sequelize.define(
    'Violation',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      property_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> property
      complaint: { type: DataTypes.STRING(255), allowNull: false },
      issue_date: { type: DataTypes.STRING(255), allowNull: false },
      types: { type: DataTypes.STRING(255), allowNull: false },
      short_desc: { type: DataTypes.STRING(255), allowNull: false },
      details: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: 'violation',
      freezeTableName: true,
      timestamps: false,
    }
  );
  Violation.associate = function (db) {
    Violation.belongsTo(db.Property, { foreignKey: 'property_id' });
  };
  return Violation;
};
