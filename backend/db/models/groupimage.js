'use strict';
const {
  Model
} = require('sequelize');

// const { Group } = require('../models')

module.exports = (sequelize, DataTypes) => {
  class GroupImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroupImage.hasMany(models.Group, {
        foreignKey: 'groupId'
      })
    }
  }
  GroupImage.init({
    groupId: DataTypes.INTEGER,
    url: DataTypes.STRING,
    preview: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GroupImage',
  });
  return GroupImage;
};