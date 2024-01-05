const express = require('express');
const router = express.Router();
const { Op, or } = require('sequelize');
// const bcrypt = require('bcryptjs');

const { requireAuth } = require('../../utils/auth');

const { User, Group, GroupImage, Membership, Venue, Event, Attendance, EventImage } = require('../../db/models');

router.use((req, res, next) => {
    console.log('Membership route hit!');
    next();
});


//Get all Members of a Group specified by its id
router.get('/groups/:groupId/members', requireAuth, async (req, res) => {

    const groupId = req.params.groupId
    const memberships = await Membership.findAll({
        where: { groupId: groupId }
    })

    const userIds = memberships.map(ele => ele.userId)
    // => [1, 4, 6]
    const users = await User.findAll({
        where: { 'id': userIds },
        attributes: ['id', 'firstName', 'lastName']
    })
    // => [{"id": ..., "firstName": ..., "lastName": ...}, {}...]

    //checking if the user is the host
    const { user } = req
    const groups = await Group.findByPk(groupId, {
        attributes: ['organizerId']
    })

    if (!groups) {
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

    if (user.id == groups.organizerId) {
        users.forEach((eachUser) => {
            const matchingMembership = memberships.find(membership => membership.userId === eachUser.id)
            // return res.status(200).json(matchingMembership)
            if (matchingMembership) {
                eachUser.setDataValue('Membership', { status: matchingMembership.status })
            }
        })
        return res.status(200).json({ Members: users })
    } else {
        const resultUsers = []
        users.forEach((eachUser) => {
            const matchingMembership = memberships.find(membership => membership.userId === eachUser.id)

            if (matchingMembership.status !== 'pending') {
                eachUser.setDataValue('Membership', { status: matchingMembership.status })
                resultUsers.push(eachUser.toJSON());
            }
        })
        return res.status(200).json({ Members: resultUsers })
    }
})



//Request a Membership for a Group based on the Group's id
router.post('/groups/:groupId/membership', requireAuth, async (req, res) => {

    const groupId = req.params.groupId
    const { user } = req
    const userId = user.id

    const memberships = await Membership.findAll({
        where: { groupId: groupId }
    })

    const group = await Group.findByPk(groupId)
    if (!group) {
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

    for (let eachMembership of memberships) {
        if (eachMembership.userId == user.id && eachMembership.status == "pending") {
            return res.status(400).json({
                "message": "Membership has already been requested"
            })
        } else if (eachMembership.userId == user.id) {
            return res.status(400).json({
                "message": "User is already a member of the group"
            })
        }
    }
    const status = 'pending'
    const newMembership = Membership.build({
        userId, groupId, status
    })
    await newMembership.save()

    const resultNewMembership = {
        memberId: newMembership.userId,
        status: status
    }
    return res.status(200).json(resultNewMembership)
})


//Change the status of a membership for a group specified by id
router.put('/groups/:groupId/membership', requireAuth, async (req, res) => {
    
    const { user } = req
    const groupId = req.params.groupId
    const { memberId, status } = req.body

    if (status == 'pending') {
        return res.status(400).json({
            "message": "Bad Request",
            "errors": {
              "status" : "Cannot change a membership status to pending"
            }
          })
    }

    const userToUpdate = await User.findByPk(memberId)
    if (!userToUpdate) {
        return res.status(404).json({
            "message": "User couldn't be found"
        })
    }

    const group = await Group.findByPk(groupId, {
        attributes: ['organizerId']
    })
    if (!group) {
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

    const membershipToUpdate = await Membership.findOne({
        where: { groupId: groupId, userId: memberId },
        attributes: ['id', 'userId', 'groupId', 'status']
    })
    // => {..}
    if (!membershipToUpdate) {
        return res.status(404).json({
            "message": "Membership between the user and the group does not exist"
        })
    }
    if (membershipToUpdate.status == 'host') {
        return res.status(400).json({
            "message": "Can not change host"
        })
    }

    if (membershipToUpdate.status == 'pending' && status == 'member') {
        if (user.id == group.organizerId) {
            membershipToUpdate.status = status
        }
    }
    if (membershipToUpdate.status == 'member' && status == 'co-host') {
        if (user.id == group.organizerId) {
            membershipToUpdate.status = status
        }
    } else {
        membershipToUpdate.status = status
    }

    const resultMembership = {
        id: membershipToUpdate.id,
        groupId: membershipToUpdate.groupId,
        memberId: membershipToUpdate.userId,
        status: membershipToUpdate.status
    }

    return res.status(200).json(resultMembership)
})

//Delete membership to a group specified by id
router.delete('/groups/:groupId/membership/:memberId', requireAuth, async (req, res) => {
    const groupId = req.params.groupId
    const memberId = req.params.memberId
    const {user} = req
    
    const group = await Group.findByPk(groupId, {
        attributes: ['organizerId']
    })
    if (!group) {
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

    const userToUpdate = await User.findByPk(memberId)
    if (!userToUpdate) {
        return res.status(404).json({
            "message": "User couldn't be found"
        })
    }

    const membership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: groupId
        },
        attributes: {exclude: ['createdAt', 'updatedAt']}
    }) 
    if (!membership) {
        return res.status(404).json({
            "message": "Membership between the user and the group does not exist"
        })
    }

    if (membership.userId == user.id || 
        group.organizerId == user.id) {
        await membership.destroy()
        return res.status(200).json({
            "message": "Successfully deleted"
          })
    }
    
    return res.status(400).json({
        "message": "Not allowed to delete membership"
      })
})



module.exports = router;