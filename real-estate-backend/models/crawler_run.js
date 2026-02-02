'use strict';

module.exports = (sequelize, DataTypes) => {
  const CrawlerRun = sequelize.define(
    'CrawlerRun',
    {
      CrawlerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      Stage: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      CrawlerFile: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      LogFile: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      CrawlerName: {
        type: DataTypes.STRING(255), // Note: Diagram shows VARCHAR(5...)
        allowNull: false,
      },
      CrDataType: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      LastRunStart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      LastRunEnd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      RunStatus: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      Proxy: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      RotateProxy: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      TimeDelay: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      Enable: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      RunDetails: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'crawler_run',
      freezeTableName: true,
      timestamps: false,
    }
  );

  CrawlerRun.associate = function (db) {
    // Association with History based on the 'crawler_id' foreign key in the History table
    CrawlerRun.hasMany(db.History, { foreignKey: 'crawler_id', sourceKey: 'CrawlerId' });
  };

  return CrawlerRun;
};