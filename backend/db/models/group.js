'use strict';
const {
  Model
} = require('sequelize');

const { Membership } = require('../models')

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsToMany(models.User, {
        through: 'Membership',
        foreignKey: 'groupId',
        otherKey: 'userId'
      })

      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId'
      })

      Group.belongsTo(models.Venue, {
        foreignKey: 'groupId'
      })

      Group.belongsTo(models.Event, {
        foreignKey: 'groupId'
      })
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    about: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    private: {
      type: DataTypes.BOOLEAN
    },
    city: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};