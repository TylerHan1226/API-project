'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Membership } = require('../models');

let options = { tableName: 'Memberships'};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
   await Membership.bulkCreate([
    {
      userId: 1,
      groupId: 1,
      status: 'co-host'
    },
    {
      userId: 1,
      groupId: 3,
      status: 'member'
    },
    {
      userId: 1,
      groupId: 4,
      status: 'member'
    },
    {
      userId: 1,
      groupId: 5,
      status: 'member'
    },
    {
      userId: 2,
      groupId: 2,
      status: 'host'
    },
    {
      userId: 3,
      groupId: 3,
      status: 'host'
    },
    {
      userId: 3,
      groupId: 4,
      status: 'pending'
    },
    {
      userId: 4,
      groupId: 4,
      status: 'co-host'
    },
    {
      userId: 4,
      groupId: 1,
      status: 'member'
    },
    {
      userId: 5,
      groupId: 5,
      status: 'host'
    },
    {
      userId: 6,
      groupId: 1,
      status: 'co-host'
    },
    {
      userId: 6,
      groupId: 2,
      status: 'member'
    },
    {
      userId: 6,
      groupId: 3,
      status: 'member'
    }
   ], options)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Memberships';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
