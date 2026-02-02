'use strict';

module.exports = (sequelize, DataTypes) => {
  const Encryptvalue = sequelize.define(
    'Encryptvalue',
    {
      encryptvalue_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      enc_table_name: { type: DataTypes.STRING(50), allowNull: false },
      enc_table_row_id: { type: DataTypes.INTEGER, allowNull: false },
      enc_column_name: { type: DataTypes.STRING(50), allowNull: false },
      encrypted_val: { type: DataTypes.STRING(100), allowNull: false },
    },
    {
      tableName: 'encryptvalue',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return Encryptvalue;
};
