'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Membership.hasMany(models.User, {
      //   foreignKey: 'userId'
      // })

      // Membership.hasMany(models.Group, {
      //   foreignKey: 'groupId'
      // })
    }
  }
  Membership.init({
    userId: {
      type: DataTypes.INTEGER
    },
    groupId: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};