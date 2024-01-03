'use strict';
const {
  Model
} = require('sequelize');

// const { Membership } = require('../models')

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      // define association here
      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: 'groupId',
        otherKey: 'userId'
      })

      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE'
      })

      Group.hasMany(models.Venue, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE'
      })

      Group.hasMany(models.Event, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE'
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