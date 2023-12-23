'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Group } = require('../models');

let options = { tableName: 'Groups'};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await Group.bulkCreate([
    // Events:
    // {
    //   name: 'Ultra Music Festival Miami 2023',
    //   about: 'For EDM fans around the world, Ultra in Miami is a must-stop on the international circuit. While most of the United States is shivering in parkas waiting for the summer festival season, Ultra fans are dancing their asses off in sunny Miami. The show always delivers surprises – both in the musical acts and the fans that attend.',
    //   type: 'Music Festival',
    //   private: false,
    //   city: 'Miami',
    //   state: 'Florida'
    // },
    // {
    //   name: 'EDC Las Vegas 2023',
    //   about: "The Electric Daisy Carnival brings all the glitter and glam of Las Vegas to this three-day celebration of electronic music. Now a worldwide phenomenon, there's no place like home for the flagship version of EDC, which shows off hundreds of performers set to the backdrop of a full-sized carnival.",
    //   type: 'Music Festival',
    //   private: false,
    //   city: 'Las Vegas',
    //   state: 'Nevada'
    // },
    // {
    //   name: 'Coachella Music Festival 2023',
    //   about: 'Like a barometer always reading a temperature of awesome, the traditional kickoff to the summer festival season is dominated by Coachella. The glitz and glamour of Los Angeles migrates east to the Indio desert for back to back weekends of the biggest names in music. What started as a small electronic festival in the desert has transformed into a cultural touchstone for the festival season.',
    //   type: 'Music Festival',
    //   private: false,
    //   city: 'Indio',
    //   state: 'California'
    // },
    {
      organizerId: 1,
      name: 'EDM squad',
      about: 'This is a group for everyone loves EDM!',
      type: 'music group',
      private: false,
      city: 'Los Angeles',
      state: 'California'
    },
    {
      organizerId: 2,
      name: 'League of Legends Team',
      about: 'This is a group for everyone loves EDM!',
      type: 'music group',
      private: false,
      city: 'Los Angeles',
      state: 'California'
    },
    {
      organizerId: 3,
      name: 'Weekend hoops',
      about: 'This is a group for everyone loves EDM!',
      type: 'music group',
      private: false,
      city: 'Los Angeles',
      state: 'California'
    },
    {
      organizerId: 4,
      name: 'Pokemon Go!',
      about: 'This is a group for everyone loves EDM!',
      type: 'music group',
      private: false,
      city: 'Los Angeles',
      state: 'California'
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
