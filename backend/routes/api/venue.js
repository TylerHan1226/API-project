const express = require('express');
const router = express.Router();
const { Op, or } = require('sequelize');


const { requireAuth } = require('../../utils/auth');

const { User, Group, GroupImage, Membership, Venue } = require('../../db/models');



router.use((req, res, next) => {
    console.log('Venue route hit!');
    next();
});

//Get All Venues for a Group specified by its id
router.get('/groups/:groupId/venues', requireAuth, async (req, res) => {
    const { user } = req
    const groupId = req.params.groupId

    const group = await Group.findByPk(groupId)
    if (!group) {
        return res.status(404).json({ "message": "Group couldn't be found" })
    }

    if (group.organizerId == user.id) {
        const venues = await Venue.findAll({
            where: {
                groupId: groupId
            },
            attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
        })
        res.status(200)
        return res.json({ 'Venues': venues })
    }

    // Authorization
    
    const memberships = await Membership.findAll({
        where: { groupId: groupId }
    })
    // return res.status(200).json(memberships)
    let membershipIndex
    for (let eachMembership of memberships) {
        if (eachMembership.userId == user.id) {
            membershipIndex = memberships.indexOf(eachMembership)
        }
    }
    if (membershipIndex === undefined || isNaN(membershipIndex) || membershipIndex < 0) {
        return res.status(400).json({
            "message": "Not Authorized"
        })
    }
    if (memberships[membershipIndex].status !== 'host' && memberships[membershipIndex].status !== 'co-host') {
        return res.status(400).json({
            "message": "Not Authorized"
        })
    }

    const venues = await Venue.findAll({
        where: {
            groupId: groupId
        },
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
    })
    res.status(200)
    return res.json({ 'Venues': venues })
})


// Create a new Venue for a Group specified by its id
router.post('/groups/:groupId/venues', requireAuth, async (req, res) => {

    const validationErrorsObj = {};
    const { address, city, state, lat, lng } = req.body
    if (!address) {
        validationErrorsObj.address = 'Street address is required'
    }
    if (!city) {
        validationErrorsObj.city = 'City is required'
    }
    if (!state) {
        validationErrorsObj.city = 'State is required'
    }
    if (lat < -90 || lat > 90) {
        validationErrorsObj.lat = 'Latitude must be within -90 and 90'
    }
    if (lng < -180 || lng > 180) {
        validationErrorsObj.lng = 'Longitude must be within -180 and 180'
    }
    if (Object.keys(validationErrorsObj).length > 0) {
        res.status(400)
        return res.json({
            message: 'Bad Request',
            errors: validationErrorsObj,
        });
    }


    const groupId = req.params.groupId
    const group = await Group.findByPk(groupId)
    if (!group) {
        return res.status(404).json({ "message": "Group couldn't be found" })
    }

    const newVenue = Venue.build({
        groupId, address, city, state, lat, lng
    });

    // Authorization
    const { user } = req
    if(group.organizerId == user.id){
        await newVenue.save()

        const responseVenue = {
            id: newVenue.id,
            groupId: newVenue.groupId,
            address: newVenue.address,
            city: newVenue.city,
            state: newVenue.state,
            lat: newVenue.lat,
            lng: newVenue.lng,
        };
    
        res.status(200)
        return res.json(responseVenue)
    }

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
        return res.status(400).json({
            "message": "Not Authorized"
        })
    }
    if (memberships[membershipIndex].status !== 'host' && memberships[membershipIndex].status !== 'co-host') {
        return res.status(400).json({
            "message": "Not Authorized"
        })
    }

    await newVenue.save()

    const responseVenue = {
        id: newVenue.id,
        groupId: newVenue.groupId,
        address: newVenue.address,
        city: newVenue.city,
        state: newVenue.state,
        lat: newVenue.lat,
        lng: newVenue.lng,
    };

    res.status(200)
    return res.json(responseVenue)

})



//Edit a Venue specified by its id
router.put('/venues/:venueId', requireAuth, async (req, res) => {

    const { address, city, state, lat, lng } = req.body

    const validationErrorsObj = {};
    if (!address) {
        validationErrorsObj.address = 'Street address is required'
    }
    if (!city) {
        validationErrorsObj.city = 'City is required'
    }
    if (!state) {
        validationErrorsObj.city = 'State is required'
    }
    if (lat < -90 || lat > 90) {
        validationErrorsObj.lat = 'Latitude must be within -90 and 90'
    }
    if (lng < -180 || lng > 180) {
        validationErrorsObj.lng = 'Longitude must be within -180 and 180'
    }
    if (Object.keys(validationErrorsObj).length > 0) {
        res.status(400)
        return res.json({
            message: 'Bad Request',
            errors: validationErrorsObj,
        })
    }
    if (Object.keys(validationErrorsObj).length > 0) {
        return res.status(400).json({
            message: 'Bad Request',
            errors: validationErrorsObj,
        });
    }

    
    const venueId = req.params.venueId
    const venue = await Venue.findByPk(venueId)
    if (!venue) {
        return res.json({ "message": "Venue couldn't be found" })
    }
    const groupId = venue.groupId

    // Authorization
    const { user } = req
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
        return res.status(400).json({
            "message": "Not Authorized"
        })
    }
    if (memberships[membershipIndex].status !== 'host' && memberships[membershipIndex].status !== 'co-host') {
        return res.status(400).json({
            "message": "Not Authorized"
        })
    }
    
    //build/edit
    venue.address = address
    venue.city = city
    venue.state = state
    venue.lat = lat
    venue.lng = lng

    const responseVenue = {
        id: venue.id,
        groupId: venue.groupId,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        lat: venue.lat,
        lng: venue.lng,
    };

    await venue.save()
    return res.status(200).json(responseVenue)
})





module.exports = router;