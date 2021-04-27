'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Fund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Fund.hasMany(models.Donation, {
        as: 'usersDonate',
        foreignKey: {
          name: 'fundId',
        },
      });

      Fund.belongsTo(models.User, {
        as: 'user',
        foreignKey: {
          name: 'userId',
        },
      });
    }
  }
  Fund.init({
    title: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    goal: DataTypes.INTEGER,
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Fund',
    tableName: 'funds',
    paranoid: true,
  });
  return Fund;
};
