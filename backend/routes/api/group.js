const express = require('express');
const router = express.Router();
const { Op, or } = require('sequelize');
// const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');

const { User, Group, GroupImage, Membership, Venue } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const group = require('../../db/models/group');

router.use((req, res, next) => {
    console.log('Group route hit!');
    next();
});

//Get all Groups
router.get('/', async (req, res) => {
    const groups = await Group.findAll({
        include: [{ model: User }]
    })
    res.status(200)
    res.json(groups)
})
// Error: "SQLITE_ERROR: no such column: Group.groupId"???
// problem with association?? happens when deploy too


// Get all Groups joined or organized by the Current User
router.get('/', requireAuth, async (req, res) => {
    const { user } = req;
    if (user) {
        const id = user.id
        const groups = await Group.findByPk(id)
        res.status(200)
        return res.json({ 'Groups': groups })
    }
})
//needs to add numMembers, previewImage
// Error: SQLITE_ERROR: no such column: groupId



// Get details of a Group from an id
router.get('/:id', requireAuth, async (req, res) => {
    const id = req.params.id
    // console.log(id)
    const groups = await Group.findByPk(id);

    //get number of members from Membership
    const members = await Membership.findAll({
        include: {model: Group},
        where: { groupId: id }
    })
    const numMembers = members.length;

    //get groupImages
    const groupImages = await GroupImage.findAll({
        include: {model: Group},
        where: { groupId: id },
        attributes: ["id", "url", "preview"]
    });

    //get organizer
    const organizer = await User.findAll({
        include: {model: Group},
        where: { id: groups.organizerId },
        attributes: ["id", "firstName", "lastName"]
    });

    //get Venues
    const venues = await Venue.findAll({
        include: {model: Group},
        where: {
            groupId: id
        }
    });

    groups.GroupImages = groupImages
    groups.Organizer = organizer
    groups.Venues = venues
    groups.numMembers = numMembers
    res.status(200)
    return res.json(groups);
})
// needs to add numMembers, GroupImages, Organizer, Venues
// Error: SQLITE_ERROR: no such column: groupId






module.exports = router;