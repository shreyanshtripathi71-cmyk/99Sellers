'use strict';

module.exports = (sequelize, DataTypes) => {
  const Ownername = sequelize.define(
    'Ownername',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      PLastName: { type: DataTypes.STRING(50), allowNull: false },
      PMiddleName: { type: DataTypes.STRING(50), allowNull: false },
      PFirstName: { type: DataTypes.STRING(50), allowNull: false },
      PcompanyName: { type: DataTypes.STRING(255), allowNull: false },
      PMotiveType: { type: DataTypes.CHAR(3), allowNull: false },
      counties: { type: DataTypes.STRING(255), allowNull: false },
      html: { type: DataTypes.TEXT, allowNull: false },
      hash: { type: DataTypes.STRING(255), allowNull: false },
      page_id: { type: DataTypes.INTEGER, allowNull: false },
      parsed: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: 'ownername',
      freezeTableName: true,
      timestamps: false,
    }
  );
  Ownername.associate = function (db) {
    Ownername.hasMany(db.ErroneousLinks, { foreignKey: 'ownername_id' });
    Ownername.hasMany(db.FilesUrls, { foreignKey: 'ownername_id' });
    Ownername.hasMany(db.PagesUrls, { foreignKey: 'ownername_id' });
  };
  return Ownername;
};
