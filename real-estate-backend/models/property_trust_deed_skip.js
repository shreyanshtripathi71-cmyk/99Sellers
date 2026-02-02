'use strict';

module.exports = (sequelize, DataTypes) => {
  const PropertyTrustDeedSkip = sequelize.define(
    'PropertyTrustDeedSkip',
    {
      trust_deed_doc: { type: DataTypes.STRING(70), allowNull: false },
      dttm: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: 'property_trust_deed_skip',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return PropertyTrustDeedSkip;
};
