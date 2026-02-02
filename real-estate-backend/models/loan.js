'use strict';

module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define(
    'Loan',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      property_id: { type: DataTypes.INTEGER, allowNull: true }, // FK -> property - made nullable
      deed_id: { type: DataTypes.STRING(50), allowNull: false },
      borrower_name: { type: DataTypes.STRING(100), allowNull: false },
      lender_name: { type: DataTypes.STRING(100), allowNull: false },
      lender_address: { type: DataTypes.STRING(255), allowNull: false },
      datetime: { type: DataTypes.DATE, allowNull: false },
      loan_amount: { type: DataTypes.FLOAT(10, 2), allowNull: false },
    },
    {
      tableName: 'loan',
      freezeTableName: true,
      timestamps: false,
    }
  );
  Loan.associate = function (db) {
    Loan.belongsTo(db.Property, { foreignKey: 'property_id' });
  };
  return Loan;
};
