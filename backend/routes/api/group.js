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
    res.json({ 'Groups': groups })
})



// Get all Groups joined or organized by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    if (user) {
        const safeUser = {
            id: user.id
        }

        const groupIds = await Membership.findAll({
            where: { userId: safeUser.id },
            attributes: ['groupId']
        })
        //==> [{"groupId": 1}, {"groupId": 3}, {"groupId": 4}, {"groupId": 5}]

        const groupIdsArr = groupIds.map(element => element.groupId);
        //=> [1, 3, 4, 5]

        //need user joined
        const groups = await Group.findAll({
            where: { id: groupIdsArr }
        })
        // => [{}, {}, ...] groups are selected

        const members = await Membership.findAll({
            where: { groupId: groupIdsArr },
            // attributes: [preview]
        })

        const numMembersArr = [];
        for (const eachId of groupIdsArr) {
            const groupsArr = members.filter(ele => ele.groupId === eachId);
            numMembersArr.push(groupsArr.length);
        }
        //=> [3, 3, 3, 2]

        const groupImages = await GroupImage.findAll({
            where: { groupId: groupIdsArr },
            attributes: ["url"]
        })
        //=> [{url: }, {url: }, ...]
        const Groups = groups.map((eachGroup, groupIndex) => ({
            id: eachGroup.id,
            organizerId: eachGroup.organizerId,
            name: eachGroup.name,
            about: eachGroup.about,
            type: eachGroup.type,
            private: eachGroup.private,
            city: eachGroup.city,
            state: eachGroup.state,
            createdAt: eachGroup.createdAt,
            updatedAt: eachGroup.updatedAt,
            numMembers: numMembersArr[groupIndex],
            previewImage: groupImages[groupIndex]?.url || null,
        }));

        res.status(200)
        return res.json(Groups)
    }
})





// Get details of a Group from an id
router.get('/:groupId', requireAuth, async (req, res) => {
    const id = req.params.groupId
    const groups = await Group.findByPk(id);

    //get number of members from Membership
    const members = await Membership.findAll({
        where: { groupId: id }
    })
    const numMembers = members.length;
    // => 3

    //get groupImages
    const groupImages = await GroupImage.findAll({
        where: { groupId: id },
        attributes: ["id", "url", "preview"]
    });
    // => [{"id":..., "url":..., "preview":...}]

    //get organizer
    const organizer = await User.findAll({
        where: { id: groups.organizerId },
        attributes: ["id", "firstName", "lastName"]
    });
    // => [{"id", "firstName", "lastName"}]

    //get Venues
    const venues = await Venue.findAll({
        where: {
            groupId: id
        },
        attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"]
    });
    // const venuesJson = venues.toJSON()
    // console.log("venues (json) ===> ", venuesJson)
    const response = {
        id: groups.id,
        organizerId: groups.organizerId,
        name: groups.name,
        about: groups.about,
        type: groups.type,
        private: groups.private,
        city: groups.city,
        state: groups.state,
        createdAt: groups.createdAt,
        updatedAt: groups.updatedAt,
        numMembers: numMembers,
        GroupImages: groupImages,
        Organizer: organizer,
        Venues: venues
    };

    res.status(200)
    return res.json(response);
})
// needs to add numMembers, GroupImages, Organizer, Venues
// Error: SQLITE_ERROR: no such column: groupId




module.exports = router;