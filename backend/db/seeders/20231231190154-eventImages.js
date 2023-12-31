'use strict';

/** @type {import('sequelize-cli').Migration} */

const { EventImage } = require('../models');
let options = { tableName: 'EventImages'};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: 'https://edmidentity.com/wp-content/uploads/2022/01/FJWgx3wXMAANl_R.jpg',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://newsaf.cgtn.com/news/2021-11-07/Edward-Gaming-wins-2021-League-of-Legends-World-Championship-14YMbS1xCAE/img/8de275c285ad4e8d89a8932bd545b5bf/8de275c285ad4e8d89a8932bd545b5bf.png',
        preview: true
      },
      {
        eventId: 3,
        url: 'https://lh3.googleusercontent.com/p/AF1QipPHEWs5_lbvHfgt9cH2TLGgbWM2z3tzj_6WuyQZ=s680-w680-h510',
        preview: true
      },
      {
        eventId: 4,
        url: 'https://lh3.googleusercontent.com/n3E6zYGD2RoEOEa1X62a8LZZMDLHF-7aygQT-7K0UrydNDOj1f4xprCAJxT6Yuuy_YvQ-KYKmUMs8RdxfiVj-7QbAja9tjMhYoUIS-YiSvi4=rw-e365-w1440',
        preview: true
      },
      {
        eventId: 5,
        url: 'https://www.welikela.com/wp-content/uploads/2018/04/getty-center.jpg',
        preview: true
      }
    ], options)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
