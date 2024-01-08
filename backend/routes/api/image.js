const express = require('express');
const router = express.Router();
const { Op, or } = require('sequelize');
// const bcrypt = require('bcryptjs');

const { requireAuth } = require('../../utils/auth');

const { User, Group, GroupImage, Membership, Venue, Event, Attendance, EventImage } = require('../../db/models');

router.use((req, res, next) => {
    console.log('Image route hit!');
    next();
});



//Delete an Image for a Group
router.delete('/group-images/:imageId', requireAuth, async (req, res) => {
    const { user } = req
    const imageId = req.params.imageId
    const groupImage = await GroupImage.findByPk(imageId)

    if (!groupImage) {
        return res.status(404).json({
            "message": "Group Image couldn't be found"
        })
    }
    const group = await Group.findByPk(groupImage.groupId)
    if (user.id == group.organizerId) {
        await groupImage.destroy()
        return res.status(200).json({
            "message": "Successfully deleted"
        })
    }

    const memberships = await Membership.findAll({
        where: { groupId: groupImage.groupId }
    })

    let membershipIndex
    for (let eachMembership of memberships) {
        if (eachMembership.userId == user.id) {
            membershipIndex = memberships.indexOf(eachMembership)
        }
    }
    if (membershipIndex === undefined || isNaN(membershipIndex) || membershipIndex < 0) {
        return res.status(403).json({
            "message": "Not Authorized"
        })
    }

    if (memberships[membershipIndex].status == 'host' || memberships[membershipIndex].status == 'co-host') {
        await groupImage.destroy()
        return res.status(200).json({
            "message": "Successfully deleted"
        })
    }  
     else {
        return res.status(403).json({
            "message": "Can not delete image"
        })
    }
})


//Delete an Image for an Event
router.delete('/event-images/:imageId', requireAuth, async (req, res) => {
    const { user } = req
    const imageId = req.params.imageId
    const eventImage = await EventImage.findByPk(imageId)

    if (!eventImage) {
        return res.status(404).json({
            "message": "Event Image couldn't be found"
        })
    }

    const event = await Event.findByPk(eventImage.eventId, {
        attributes: ['groupId']
    })
    const group = await Group.findByPk(event.groupId)
    if (user.id == group.organizerId) {
        await eventImage.destroy()
        return res.status(200).json({
            "message": "Successfully deleted"
        })
    }


    const memberships = await Membership.findAll({
        where: { groupId: event.groupId }
    })

    let membershipIndex
    for (let eachMembership of memberships) {
        if (eachMembership.userId == user.id) {
            membershipIndex = memberships.indexOf(eachMembership)
        }
    }
    if (membershipIndex === undefined || isNaN(membershipIndex) || membershipIndex < 0) {
        return res.status(403).json({
            "message": "Not Authorized"
        })
    }

    if (memberships[membershipIndex].status == 'host' || memberships[membershipIndex].status == 'co-host') {
        await eventImage.destroy()
        return res.status(200).json({
            "message": "Successfully deleted"
        })
    }  
     else {
        return res.status(403).json({
            "message": "Can not delete image"
        })
    }
})





module.exports = router;