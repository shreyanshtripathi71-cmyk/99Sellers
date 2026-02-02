'use strict';

module.exports = (sequelize, DataTypes) => {
  const Owner = sequelize.define(
    'Owner',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      OLastName: { type: DataTypes.STRING(50), allowNull: false },
      OMiddleName: { type: DataTypes.STRING(50), allowNull: false },
      OFirstName: { type: DataTypes.STRING(50), allowNull: false },
      OStreetAddr1: { type: DataTypes.STRING(100), allowNull: false },
      OStreetAddr2: { type: DataTypes.STRING(100), allowNull: false },
      OCity: { type: DataTypes.STRING(50), allowNull: false },
      OState: { type: DataTypes.STRING(30), allowNull: false },
      OZip: { type: DataTypes.STRING(20), allowNull: false },
      OProperty_id: { type: DataTypes.INTEGER, allowNull: true }, // FK -> property - made nullable
      insert_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: 'owner',
      freezeTableName: true,
      timestamps: false,
    }
  );
  Owner.associate = function (db) {
    Owner.belongsTo(db.Property, { foreignKey: 'OProperty_id' });
  };
  return Owner;
};
