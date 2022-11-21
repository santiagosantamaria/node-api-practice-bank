'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transaction.init({
    fromAccount: DataTypes.STRING,
    toAccount: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    description: DataTypes.STRING(100),
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};