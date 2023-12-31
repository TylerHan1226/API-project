'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Group } = require('../models');

let options = { tableName: 'Groups'};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
   await Group.bulkCreate([
    {
      organizerId: 1,
      name: 'EDM squad',
      about: 'This is a group for everyone loves EDM!',
      type: 'In person',
      private: false,
      city: 'Los Angeles',
      state: 'California'
    },
    {
      organizerId: 2,
      name: 'League of Legends Team',
      about: 'The best team of 5',
      type: 'Online',
      private: false,
      city: 'Cincinnati',
      state: 'Ohio'
    },
    {
      organizerId: 3,
      name: 'Weekend hoopers',
      about: 'The weekend gathering basketball group',
      type: 'In person',
      private: false,
      city: 'New York City',
      state: 'New York'
    },
    {
      organizerId: 4,
      name: 'Pokemon Go!',
      about: 'This is a group for everyone loves EDM!',
      type: 'In person',
      private: false,
      city: 'San Francisco',
      state: 'California'
    },
    {
      organizerId: 5,
      name: 'Architecture Explorers',
      about: 'This is a group for the people who are passionate for architecture and urban fabric',
      type: 'In person',
      private: true,
      city: 'Los Angeles',
      state: 'California'
    }
   ], options)
  },

  async down (queryInterface, Sequelize) {
    // options.tableName = 'Groups';
    // return queryInterface.bulkDelete(options, {}, {});
  }
};
