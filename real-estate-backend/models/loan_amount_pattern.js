'use strict';

module.exports = (sequelize, DataTypes) => {
  const LoanAmountPattern = sequelize.define(
    'LoanAmountPattern',
    {
      pattern_level: { type: DataTypes.INTEGER, allowNull: false },
      loan_amount_pattern: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: 'loan_amount_pattern',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return LoanAmountPattern;
};
