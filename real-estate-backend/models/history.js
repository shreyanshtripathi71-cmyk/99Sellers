'use strict';

module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define(
    'History',
    {
      page: { type: DataTypes.INTEGER, allowNull: false },
      ad_number: { type: DataTypes.INTEGER, allowNull: false },
      crawler_id: { type: DataTypes.INTEGER, allowNull: false }, // FK -> crawler_run
    },
    {
      tableName: 'history',
      freezeTableName: true,
      timestamps: false,
    }
  );
  History.associate = function (db) {
    History.belongsTo(db.CrawlerRun, { foreignKey: 'crawler_id', targetKey: 'CrawlerId' });
  };
  return History;
};
