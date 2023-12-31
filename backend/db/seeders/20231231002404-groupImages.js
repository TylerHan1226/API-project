'use strict';

/** @type {import('sequelize-cli').Migration} */

const { GroupImage } = require('../models');

let options = { tableName: 'GroupImages'};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: 'https://www.lostlandsfestival.com/wp-content/uploads/2023/10/Lost_Lands_2023_Pics_14.jpg',
        preview: true
      },
      {
        groupId: 2,
        url: 'https://static.invenglobal.com/upload/image/2017/02/22/i1487753623863997.jpeg',
        preview: true
      },
      {
        groupId: 3,
        url: 'https://www.si.com/college/recruiting/basketball/the-professor-grayson-boucher-and1-mixtape-streetball-social-injustice-racism',
        preview: true
      },
      {
        groupId: 4,
        url: 'https://lh3.googleusercontent.com/n3E6zYGD2RoEOEa1X62a8LZZMDLHF-7aygQT-7K0UrydNDOj1f4xprCAJxT6Yuuy_YvQ-KYKmUMs8RdxfiVj-7QbAja9tjMhYoUIS-YiSvi4=rw-e365-w1440',
        preview: true
      },
      {
        groupId: 5,
        url: 'https://www.tripsavvy.com/thmb/GsWkeg3Z1dPlB5ercleP7FxtxJI=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/KusamainfinityroomGettyImages-539583358-09d09da8beb941c1b34e921c3ef5d995.jpg',
        preview: true
      },
    ], options)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
