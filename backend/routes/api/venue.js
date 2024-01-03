const express = require('express');
const router = express.Router();
const { Op, or } = require('sequelize');


const { requireAuth } = require('../../utils/auth');

const { User, Group, GroupImage, Membership, Venue } = require('../../db/models');
const { route } = require('./group');


router.use((req, res, next) => {
    console.log('Venue route hit!');
    next();
});

//Get All Venues for a Group specified by its id
router.get('/groups/:groupId/venues', async (req, res) => {
    const groupId = req.params.groupId
    const venues = await Venue.findAll({
        where: {
            groupId: groupId
        },
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
    })

    res.status(200)
    return res.json({ 'Venues': venues})
})










module.exports = router;