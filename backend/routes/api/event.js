const express = require('express');
const router = express.Router();
const { Op, or } = require('sequelize');
// const bcrypt = require('bcryptjs');

const { requireAuth } = require('../../utils/auth');

const { User, Group, GroupImage, Membership, Venue, Event, Attendance, EventImage } = require('../../db/models');

router.use((req, res, next) => {
    console.log('Event route hit!');
    next();
});



//Get all Events
router.get('/events', requireAuth, async (req, res) => {


    const events = await Event.findAll({
        attributes: ['id', 'venueId', 'groupId', 'name', 'type', 'startDate', 'endDate']
    })

    const eventIds = await Event.findAll({
        attributes: ['id']
    })
    const eventIdsArr = eventIds.map(element => element.id);
    // => [1, 2, 3, 4, 5]

    const attendances = await Attendance.findAll()
    const numAttending = [];
    for (const eachId of eventIdsArr) {
        const attArr = attendances.filter(ele => ele.eventId === eachId);
        numAttending.push(attArr.length);
    }
    // => [3, 5, 3, 4, 3]

    const eventImages = await EventImage.findAll({
        where: { eventId: eventIdsArr, preview: true },
        attributes: ["url"]
    })
    //=> [{url: }, {url: }, ...]

    const groups = await Group.findAll({
        attributes: ['id', 'name', 'city', 'state']
    })

    let resultEvents = events.map((eachEvent, eventIndex) => ({
        id: eachEvent.id,
        groupId: eachEvent.groupId,
        venueId: eachEvent.venueId,
        name: eachEvent.name,
        type: eachEvent.type,
        startDate: eachEvent.startDate,
        endDate: eachEvent.endDate,
        numMembers: numAttending[eventIndex],
        previewImage: eventImages[eventIndex].url
    }))

    for (let eachGroup of groups) {
        for (let eachResultEvent of resultEvents) {
            if (eachGroup.id == eachResultEvent.id) {
                eachResultEvent.Group = eachGroup
            }
        }
    }

    const venues = await Venue.findAll({
        attributes: ['id', 'city', 'state']
    })
    for (let eachVenue of venues) {
        for (let eachResultEvent of resultEvents) {
            if (eachVenue.id == eachResultEvent.id) {
                eachResultEvent.Venue = eachVenue
            }
        }
    }
    return res.status(200).json({ 'Events': resultEvents })
})


//Get all Events of a Group specified by its id
router.get('/groups/:groupId/events', requireAuth, async (req, res) => {
    try {
        const groupId = req.params.groupId

        const events = await Event.findAll({
            where: {
                groupId: groupId
            },
            attributes: ['id', 'venueId', 'groupId', 'name', 'type', 'startDate', 'endDate']
        })
    
        const eventIds = await Event.findAll({
            attributes: ['id']
        })
        const eventIdsArr = eventIds.map(element => element.id);
        // => [1, 2, 3, 4, 5]
    
        const attendances = await Attendance.findAll()
        const numAttending = [];
        for (const eachId of eventIdsArr) {
            const attArr = attendances.filter(ele => ele.eventId === eachId);
            numAttending.push(attArr.length);
        }
        // => [3, 5, 3, 4, 3]
    
        const eventImages = await EventImage.findAll({
            where: { eventId: eventIdsArr, preview: true }
        })
        //=> [{url: }, {url: }, ...]
    
        const groups = await Group.findAll({
            attributes: ['id', 'name', 'city', 'state']
        })
    
        let resultEvents = events.map((eachEvent, eventIndex) => ({
            id: eachEvent.id,
            groupId: eachEvent.groupId,
            venueId: eachEvent.venueId,
            name: eachEvent.name,
            type: eachEvent.type,
            startDate: eachEvent.startDate,
            endDate: eachEvent.endDate,
            numMembers: numAttending[eventIndex]
        }))
    
        
        for (let eachEventImage of eventImages) {
            for (let eachResultEvents of resultEvents) {
                if (eachEventImage.id == eachResultEvents.id) {
                    let eachEventImageUrl = eachEventImage.url
                    eachResultEvents.previewImage = eachEventImageUrl
                }
            }
        }

        for (let eachGroup of groups) {
            for (let eachResultEvent of resultEvents) {
                if (eachGroup.id == eachResultEvent.id) {
                    eachResultEvent.Group = eachGroup
                }
            }
        }

        const venues = await Venue.findAll({
            attributes: ['id', 'city', 'state']
        })
        for (let eachVenue of venues) {
            for (let eachResultEvent of resultEvents) {
                if (eachVenue.id == eachResultEvent.id) {
                    eachResultEvent.Venue = eachVenue
                }
            }
        }
        return res.status(200).json({ 'Events': resultEvents })

    } catch (error) {
        console.error(error)
        return res.status(404).json({ "message": "Group couldn't be found" })
    }
})


//Get details of an Event specified by its id
router.get('/events/:eventId', requireAuth, async (req, res) => {
    
    try {
        const eventId = req.params.eventId
        const events = await Event.findByPk(eventId, {
            attributes: ['id', 'groupId', 'venueId', 'name', 'description', 'type', 'capacity', 'price', 'startDate', 'endDate']
        })

        const group = await Group.findOne({
            where: {
                id: events.groupId
            },
            attributes: ['id', 'name', 'private', 'city', 'state']
        })

        const venue = await Venue.findOne({
            where: {
                id: events.venueId
            },
            attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
        })

        const eventImages = await EventImage.findOne({
            where: {
                id: events.groupId
            },
            attributes: ['id', 'url', 'preview']
        })

        const resultEvent = {
            id: events.id,
            groupId: events.groupId,
            venueId: events.venueId,
            name: events.name,
            description: events.description,
            type: events.type,
            capacity: events.capacity,
            price: events.price,
            startDate: events.startDate,
            endDate: events.endDate,
            Group: group,
            Venue: venue,
            EventImages: eventImages
        }

        return res.status(200).json(resultEvent);

    } catch (error) {
        console.error(error)
        return res.status(404).json({ "message": "Event couldn't be found" })
    }
})


//Create an Event for a Group specified by its id
router.post('/groups/:groupId/events', requireAuth, async (req, res) => {
    const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body
    const groupId = req.params.groupId

    const validationErrorsObj = {}
    const currentDate = new Date();
    if (!name || name.length < 5) {
        validationErrorsObj.name = 'Name must be at least 5 characters';
    }
    if (!type ||!['Online', 'In person'].includes(type)) {
        validationErrorsObj.type = 'Type must be Online or In person';
    }
    if (!Number.isInteger(capacity)) {
        validationErrorsObj.capacity = 'Capacity must be an integer';
    }
    if (!typeof price === 'number') {
        validationErrorsObj.price = 'Price is invalid';
    }
    if (!description) {
        validationErrorsObj.description = 'Description is required';
    }
    if (startDate < currentDate) {
        validationErrorsObj.startDate = 'Start date must be in the future';
    }
    if (endDate < startDate) {
        validationErrorsObj.endDate = 'End date is less than start date';
    }
    if (Object.keys(validationErrorsObj).length > 0) {
        return res.status(400).json({
            message: 'Bad Request',
            errors: validationErrorsObj
        });
    }

    const newEvent = Event.build({
        venueId, groupId, name, type, capacity, price, description, startDate, endDate
    })

    await newEvent.save()

    const resultEvent = {
        id: newEvent.id,
        groupId: newEvent.groupId,
        venueId: newEvent.venueId,
        name: newEvent.name,
        type: newEvent.type,
        capacity: newEvent.capacity,
        price: newEvent.price,
        description: newEvent.description,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate
    }

    return res.status(200).json(resultEvent)
})





module.exports = router;