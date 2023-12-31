'use strict';

const bcrypt = require("bcryptjs");
const { User } = require('../models');


let options = {tableName: 'Users'};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'user1@user.io',
        username: 'User1',
        firstName: 'Tyler',
        lastName: 'Han',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user2@user.io',
        username: 'User2',
        firstName: 'Gary',
        lastName: 'Cheung',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user3@user.io',
        username: 'User3',
        firstName: 'Kevin',
        lastName: 'Fan',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user4@user.io',
        username: 'User4',
        firstName: 'Dennis',
        lastName: 'Ma',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        email: 'user5@user.io',
        username: 'User5',
        firstName: 'Tony',
        lastName: 'Han',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        email: 'user6@user.io',
        username: 'User6',
        firstName: 'Chris',
        lastName: 'Lin',
        hashedPassword: bcrypt.hashSync('password6')
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
