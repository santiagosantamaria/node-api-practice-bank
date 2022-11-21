'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Account.init({
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    clientId:{
      type: DataTypes.INTEGER,
      allowNull: false,

    },
    balance: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};