const express = require('express');
const { weeklyMeetings,createMeetings,MeetingByDay } = require('../Controllers/controllers_meetings');
const validateMeeting = require('../Middlewares/middleware')
const { validationResult } = require('express-validator');

const router = express.Router();

// Route to GET all meetings
router.get('/weeklyMeetings', weeklyMeetings);

router.post('/meetings/add', validateMeeting, (req, res, next) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next(); // Continue to the controller if validation passes
}, createMeetings);

router.get('/meetings/day',MeetingByDay)

module.exports = router;
