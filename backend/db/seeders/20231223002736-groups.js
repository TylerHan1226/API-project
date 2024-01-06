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
      name: 'EDM Squad',
      about: "Welcome to EDM Squad, the ultimate gathering for electronic music enthusiasts in LA! Immerse yourself in the pulsating beats of EDM, with a special focus on the electrifying world of EDM. Let the bass guide you, and let's create epic memories together!",
      type: 'In person',
      private: false,
      city: 'Los Angeles',
      state: 'California'
    },
    {
      organizerId: 2,
      name: 'The Best 5',
      about: "Welcome to 'The Best 5' - your gateway to exhilarating League of Legends competition! Dive into weekend showdowns where strategy meets skill on the Summoner's Rift. Unleash your gaming passion with us! 🎮",
      type: 'Online',
      private: false,
      city: 'Cincinnati',
      state: 'Ohio'
    },
    {
      organizerId: 3,
      name: "NYC Ballers' Expedition",
      about: "Welcome to 'NYC Ballers' Expedition' - where the heartbeat of New York City meets the rhythm of the basketball court. Join us on weekends as we navigate the city's concrete jungle in search of the best hoops spots. Every weekend is a new slam dunk waiting to happen!",
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
