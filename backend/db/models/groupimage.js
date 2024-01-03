'use strict';
const {
  Model
} = require('sequelize');

// const { Group } = require('../models')

module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {

    static associate(models) {
      // define association here
      GroupImage.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })
    }
  }
  GroupImage.init({
    groupId: {
      type: DataTypes.INTEGER
    },
    url: DataTypes.STRING,
    preview: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'GroupImage',
  });
  return GroupImage;
};