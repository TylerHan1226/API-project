'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Attendance } = require('../models');
let options = { tableName: 'Attendances'};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Attendance.bulkCreate([
      {
        eventId: 1,
        userId: 1,
        status: 'attending'
      },
      {
        eventId: 1,
        userId: 4,
        status: 'pending'
      },
      {
        eventId: 1,
        userId: 6,
        status: 'attending'
      },
      {
        eventId: 2,
        userId: 1,
        status: 'attending'
      },
      {
        eventId: 2,
        userId: 2,
        status: 'attending'
      },
      {
        eventId: 2,
        userId: 3,
        status: 'attending'
      },
      {
        eventId: 2,
        userId: 4,
        status: 'attending'
      },
      {
        eventId: 2,
        userId: 6,
        status: 'attending'
      },
      {
        eventId: 3,
        userId: 2,
        status: 'attending'
      },
      {
        eventId: 3,
        userId: 3,
        status: 'attending'
      },
      {
        eventId: 3,
        userId: 4,
        status: 'attending'
      },
      {
        eventId: 4,
        userId: 1,
        status: 'pending'
      },
      {
        eventId: 4,
        userId: 2,
        status: 'attending'
      },
      {
        eventId: 4,
        userId: 4,
        status: 'attending'
      },
      {
        eventId: 4,
        userId: 6,
        status: 'waitlist'
      },
      {
        eventId: 5,
        userId: 1,
        status: 'attending'
      },
      {
        eventId: 5,
        userId: 2,
        status: 'pending'
      },
      {
        eventId: 5,
        userId: 5,
        status: 'attending'
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
