'use strict';

module.exports = (sequelize, DataTypes) => {
  const Eviction = sequelize.define(
    'Eviction',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      property_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> property
      court_date: { type: DataTypes.DATEONLY, allowNull: false },
      court_docket: { type: DataTypes.STRING(100), allowNull: false },
      court_desc: { type: DataTypes.STRING(255), allowNull: false },
      court_room: { type: DataTypes.STRING(100), allowNull: false },
      details: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: 'eviction',
      freezeTableName: true,
      timestamps: false,
    }
  );
  Eviction.associate = function (db) {
    Eviction.belongsTo(db.Property, { foreignKey: 'property_id' });
  };
  return Eviction;
};
