'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Venue } = require('../models');

let options = { tableName: 'Venues'};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: '1126 Queens Hwy',
        city: 'Los Angeles',
        state: 'California',
        lat: 33.75275573889709,
        Ing: -118.19029468561867
      },
      {
        groupId: 2,
        address: '12333 W Olympic Blvd',
        city: 'Los Angeles',
        state: 'California',
        lat: 34.03280014054085,
        Ing: -118.45735745150874
      },
      {
        groupId: 3,
        address: '280 W 155th St',
        city: 'New York',
        state: 'New York',
        lat: 40.829255852380655, 
        Ing: -73.93618024723602
      },
      {
        groupId: 4,
        address: '201 Marine Dr',
        city: 'San Francisco',
        state: 'California',
        lat: 37.810791424525696, 
        Ing: -122.47708390718321
      },
      {
        groupId: 5,
        address: '1200 Getty Center Dr',
        city: 'Los Angeles',
        state: 'California',
        lat: 34.087956995679946,
        Ing: -118.47566745911918
      }
    ], options)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
