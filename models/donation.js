'use strict';

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Donation.belongsTo(models.User, {
        as: 'user',
        foreignKey: {
          name: 'donaturId',
        },
      });

      Donation.belongsTo(models.Fund, {
        as: 'fund',
        foreignKey: {
          name: 'fundId',
        },
      });
    }
  }
  Donation.init({
    donateAmount: DataTypes.INTEGER,
    status: DataTypes.STRING,
    proofAttachment: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Donation',
    tableName: 'donations',
    paranoid: true,
  });
  return Donation;
};
