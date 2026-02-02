'use strict';



module.exports = (sequelize, DataTypes) => {

  const UserLogin = sequelize.define(

    'UserLogin',

    {

      id: {

        type: DataTypes.INTEGER,

        primaryKey: true,

        autoIncrement: true,

        allowNull: false,

      },

      FirstName: { type: DataTypes.STRING(50), allowNull: false },

      LastName: { type: DataTypes.STRING(50), allowNull: false },

      Email: { type: DataTypes.STRING(50), allowNull: false },

      Contact: { type: DataTypes.STRING(50), allowNull: false },

      Address: { type: DataTypes.STRING(100), allowNull: false },

      City: { type: DataTypes.STRING(50), allowNull: false },

      State: { type: DataTypes.STRING(50), allowNull: false },

      Zip: { type: DataTypes.STRING(20), allowNull: false },

      Username: { type: DataTypes.STRING(50), allowNull: false },

      Password: { type: DataTypes.TEXT, allowNull: false },

      UserType: { type: DataTypes.STRING(50), allowNull: false },

      stripeCustomerId: { type: DataTypes.STRING, allowNull: true },

      defaultPaymentMethodId: { type: DataTypes.STRING, allowNull: true },

    },

    {

      tableName: 'user_login',

      freezeTableName: true,

      timestamps: false,

    }

  );



  return UserLogin;

};