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

    try {
        const groupId = req.params.groupId
        const venues = await Venue.findAll({
            where: {
                groupId: groupId
            },
            attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
        })
        res.status(200)
        return res.json({ 'Venues': venues })
    } catch (error) {
        console.error(error)
        return res.status(404).json({ "message": "Group couldn't be found" })
    }
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


    try {
        const groupId = req.params.groupId
        // const { address, city, state, lat, lng } = req.body
        
        const newVenue = Venue.build({
            groupId, address, city, state, lat, lng
        });
        
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
    } catch (error) {
        console.error(error)
        return res.status(404).json({ "message": "Group couldn't be found" })
    }
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
    
    //build/edit
    try {
        const venueId = req.params.venueId
        const venue = await Venue.findByPk(venueId)

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

    } catch (error) {
        console.error(error)
        res.status(404)
        return res.json({ "message": "Venue couldn't be found" })
    }
})





module.exports = router;