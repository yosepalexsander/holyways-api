'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      User.hasMany(models.Donation, {
        as: 'donations',
        foreignKey: {
          name: 'donaturId',
        },
      });

      User.hasMany(models.Fund, {
        as: 'funds',
        foreignKey: {
          name: 'userId',
        },
      });
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    paranoid: true,
  });
  return User;
};
