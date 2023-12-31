'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Event } = require('../models');

let options = { tableName: 'Events' };
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Event.bulkCreate([
      {
        venueId: 1,
        groupId: 1,
        name: 'Zombieland - Apocalypse',
        description: 'Zombieland boasts four massive stages of bass that hold the key to salvaging our world! In this dark era, Apocalypse Fest becomes more than just an escape, becoming a symbol of resilience and the triumphant spirit of humanity.',
        type: 'In person',
        capacity: 15000,
        price: 200,
        startDate: '2023-11-24',
        endDate: '2023-11-25'
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Best Team of 5',
        description: 'This is a amateur competition of League of Legends. There will be 2-4 teams selected from the group. The winner team can win a $100 dollar-worth price.',
        type: 'Online',
        capacity: 20,
        price: 5,
        startDate: '2023-12-01',
        endDate: '2023-12-01'
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'Harlem Weekend Basketball League',
        description: 'A great opportunity for amateur players to show some skills!',
        type: 'In person',
        capacity: 20,
        price: 0,
        startDate: '2024-12-02',
        endDate: '2023-12-03'
      },
      {
        venueId: 4,
        groupId: 4,
        name: 'City Pokemon Explore!',
        description: 'A gathering for the Pokemon lovers at a cafe. We will start our journey from there.',
        type: 'In person',
        capacity: 35,
        price: 20,
        startDate: '2023-11-01',
        endDate: '2023-11-01'
      },
      {
        venueId: 5,
        groupId: 5,
        name: 'Los Angeles Museum tour',
        description: 'This is a three-day architectural tour of the amazing museums in Los Angeles. We will be visiting the Getty, the Broad, Museum of Contemporary Art, La Brea Tar Pits Museum, Holocaust Museum La, etc. You will have a great opportunity to get to know the history, culture behind the buildings, and of course the architectural design concepts.',
        type: 'In person',
        capacity: 15,
        price: 250,
        startDate: '2023-12-08',
        endDate: '2023-12-10'
      }
    ], options)
  },

  async down(queryInterface, Sequelize) {
    // options.tableName = 'Events';
    // const Op = Sequelize.Op;
    // return queryInterface.bulkDelete(options, {
    //   groupId: { [Op.in]: [1, 2, 3, 4, 5] }
    // }, {});
  }
};
