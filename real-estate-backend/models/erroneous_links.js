'use strict';

module.exports = (sequelize, DataTypes) => {
  const ErroneousLinks = sequelize.define(
    'ErroneousLinks',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      proaddress_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> proaddress
      ownername_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> ownername
      url: { type: DataTypes.STRING(255), allowNull: false },
    },
    {
      tableName: 'erroneous_links',
      freezeTableName: true,
      timestamps: false,
    }
  );
  ErroneousLinks.associate = function (db) {
    ErroneousLinks.belongsTo(db.Proaddress, { foreignKey: 'proaddress_id' });
    ErroneousLinks.belongsTo(db.Ownername, { foreignKey: 'ownername_id' });
  };
  return ErroneousLinks;
};
