const express = require('express');
const router = express.Router();
const { Op, or } = require('sequelize');
// const bcrypt = require('bcryptjs');

const { requireAuth } = require('../../utils/auth');

const { User, Group, GroupImage, Membership, Venue, Event, Attendance, EventImage } = require('../../db/models');

router.use((req, res, next) => {
    console.log('Attendance route hit!');
    next();
});


//Get all Attendees of an Event specified by its id
router.get('/events/:eventId/attendees', requireAuth, async (req, res) => {
    const eventId = req.params.eventId
    // const attendees = await Attendance.findAll({
    //     where: { eventId: eventId }
    // })
    const { user } = req
    const event = await Event.findByPk(eventId, {
        attributes: ['groupId']
    })
    if (!event) {
        return res.status(404).json({
            "message": "Event couldn't be found"
        })
    }

    const memberships = await Membership.findAll({
        where: { groupId: event.groupId }
    })
   

    let resultMembership = []
    for (let eachMember of memberships) {
        if (eachMember.userId == user.id &&
            (eachMember.status == 'host' ||
                eachMember.status == 'co-host')) {
            return res.status(200).json(memberships)
        } else {

            if (eachMember.status !== 'pending') {
                resultMembership.push(eachMember)
            }

        }
    }
    return res.status(200).json(resultMembership)
})



//Request to Attend an Event based on the Event's id
router.post('/events/:eventId/attendance', requireAuth, async (req, res) => {

    const {user} = req
    const eventId = req.params.eventId
    const event = await Event.findByPk(eventId, {
        attributes: ['groupId']
    })
    if (!event) {
        return res.status(404).json({
            "message": "Event couldn't be found"
        })
    }

    const memberships = await Membership.findAll({
        where: {groupId: event.groupId},
        attributes: ['userId', 'status']
    })
    const membershipArr = memberships.map(ele => ele.userId)
    // const membershipStatusArr = memberships.map(ele => ele.status)
    //check if the member is pending, if still pending, cannot change
    for (let eachMember of memberships) {
        if (eachMember.userId == user.id && eachMember.status == 'pending') {
            return res.status(401).json({
                "message": "Must be a member of the group"
            })
        }
    }

    if (!membershipArr.includes(user.id)) {
        return res.status(401).json({
            "message": "Must be a member of the group"
        })
    }

    const attendances = await Attendance.findAll({
        where: {eventId: eventId}
    })

    for (let eachAttendees of attendances) {
        if (eachAttendees.userId == user.id && eachAttendees.status == 'pending') {
            return res.status(400).json({
                "message": "Attendance has already been requested"
            })
        }
        if (eachAttendees.userId == user.id) {
            return res.status(400).json({
                "message": "User is already an attendee of the event"
            })
        }
    }
    const newAtt = Attendance.build({
        eventId: eventId,
        userId: user.id,
        status: 'pending'
    })
    await newAtt.save()

    const resultNewAtt = {
        userId: newAtt.userId,
        status: newAtt.status
    }
    return res.status(200).json(resultNewAtt)
})


//Change the status of an attendance for an event specified by id
router.put('/events/:eventId/attendance', requireAuth, async (req, res) => {
    
    const { user } = req
    const eventId = req.params.eventId
    const { userId, status } = req.body

    // Authorization
    const groupId = event.groupId
    // const group = await Group.findByPk(groupId)
    const memberships = await Membership.findAll({
        where: { groupId: groupId }
    })
    let membershipIndex
    for (let eachMembership of memberships) {
        if (eachMembership.userId == user.id) {
            membershipIndex = memberships.indexOf(eachMembership)
        }
    }
    if (membershipIndex === undefined || isNaN(membershipIndex) || membershipIndex < 0) {
        return res.status(401).json({
            "message": "Not Authorized"
        })
    }
    if (memberships[membershipIndex].status !== 'host' && memberships[membershipIndex].status !== 'co-host') {
        return res.status(401).json({
            "message": "Not Authorized"
        })
    }
    


    if (status == 'pending') {
        return res.status(400).json({
            "message": "Bad Request",
            "errors": {
              "status" : "Cannot change a membership status to pending"
            }
          })
    }

    const userToUpdate = await User.findByPk(userId)
    if (!userToUpdate) {
        return res.status(404).json({
            "message": "User couldn't be found"
        })
    }

    const event = await Group.findByPk(eventId, {
        // attributes: ['organizerId']
    })
    if (!event) {
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

    const attendanceToUpdate = await Attendance.findOne({
        where: { eventId: eventId, userId: userId },
        attributes: ['id', 'userId', 'eventId', 'status']
    })
    // => {..}
    if (!attendanceToUpdate) {
        return res.status(404).json({
            "message": "Attendance between the user and the event does not exist"
        })
    }

    if (attendanceToUpdate.status == 'pending' && status == 'member') {
        attendanceToUpdate.status = status
        const resultAttendee = {
            id: attendanceToUpdate.id,
            eventId: attendanceToUpdate.eventId,
            userId: attendanceToUpdate.userId,
            status: attendanceToUpdate.status
        }
        return res.status(200).json(resultAttendee)    
    }
    if (attendanceToUpdate.status == 'member' && status == 'co-host') {
        attendanceToUpdate.status = status 
        const resultAttendee = {
            id: attendanceToUpdate.id,
            eventId: attendanceToUpdate.eventId,
            userId: attendanceToUpdate.userId,
            status: attendanceToUpdate.status
        }
        return res.status(200).json(resultAttendee)
    } else {
        return res.status(401).json({
            "message": "Not Authorized"
        })
    }
    
})


//Delete attendance to an event specified by id
//'/groups/:groupId/membership/:memberId'
router.delete('/events/:eventId/attendance/:userId', requireAuth, async (req, res) => {
    const eventId = req.params.eventId
    const userId = req.params.userId
    const {user} = req
    
    const event = await Event.findByPk(eventId)
    if (!event) {
        return res.status(404).json({
            "message": "Event couldn't be found"
        })
    }
    // return res.status(200).json(event.groupId)
    
    const userToUpdate = await User.findByPk(userId)
    if (!userToUpdate) {
        return res.status(404).json({
            "message": "User couldn't be found"
        })
    }

    const attendances = await Attendance.findOne({
        where: {
            userId: userId,
            eventId: eventId
        },
        attributes: {exclude: ['createdAt', 'updatedAt']}
    }) 
    if (!attendances) {
        return res.status(404).json({
            "message": "Attendance does not exist for this User"
        })
    }

    const group = await Group.findByPk(event.groupId)
    // return res.status(200).json(group)

    if (attendances.userId == user.id || 
        group.organizerId == user.id) {
        await attendances.destroy()
        return res.status(200).json({
            "message": "Successfully deleted"
          })
    }
    
    return res.status(401).json({
        "message": "Not allowed to delete membership"
      })
})


module.exports = router;