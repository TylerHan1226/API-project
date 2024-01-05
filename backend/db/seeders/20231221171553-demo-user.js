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
      },
      {
        email: 'user7@user.io',
        username: 'User7',
        firstName: 'Jack',
        lastName: 'Nicholson',
        hashedPassword: bcrypt.hashSync('password7')
      },
      {
        email: 'user8@user.io',
        username: 'User8',
        firstName: 'Edward',
        lastName: 'Norton',
        hashedPassword: bcrypt.hashSync('password8')
      },
      {
        email: 'user9@user.io',
        username: 'User9',
        firstName: 'Christian',
        lastName: 'Bale',
        hashedPassword: bcrypt.hashSync('password9')
      },
      {
        email: 'user10@user.io',
        username: 'User10',
        firstName: 'Erling',
        lastName: 'Haaland',
        hashedPassword: bcrypt.hashSync('password10')
      },
      {
        email: 'user11@user.io',
        username: 'User11',
        firstName: 'Marilyn',
        lastName: 'Manson',
        hashedPassword: bcrypt.hashSync('password11')
      },
      {
        email: 'user12@user.io',
        username: 'User12',
        firstName: 'Jessica',
        lastName: 'Audiffred',
        hashedPassword: bcrypt.hashSync('password12')
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
