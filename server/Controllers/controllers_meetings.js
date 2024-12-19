const Meeting = require('../Models/model_meeting');
const moment = require('moment'); // For easier date manipulation, use moment.js or native JS Date methods
const { parseISO, startOfDay, endOfDay, formatISO } = require('date-fns');

// return all meeting at end of the week

exports.weeklyMeetings = async (req, res) => {
    try {
        const { date } = req.query; // Optional query parameter for an ISO date
        console.log('date', date);

        let startDate, endDate;

        if (!date) {
            // Use today's date
            startDate = moment().startOf('day'); // Start of today
            endDate = moment().endOf('week'); // End of the current week
        } else {
            // Provided date is used
            const providedDate = moment(date).startOf('day');
            startDate = providedDate.clone(); // Start of the provided date
            endDate = providedDate.clone().endOf('week'); // End of the week for the provided date
        }

        // Query the database for meetings within the calculated date range
        const meetings = await Meeting.find({
            startTime: { $gte: startDate.toISOString(), $lte: endDate.toISOString() },
        });

        res.status(200).json(meetings); // Send the meetings as a response
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving meetings', error: error.message });
    }
};

exports.createMeetings = async (req, res) => {
    try {
        const { customerName, customerMail, title, startTime, endTime, userBooker, to, id } = req.body;

        // Create a new meeting document
        const newMeeting = new Meeting({
            customerName,
            customerMail,
            title,
            startTime,
            endTime,
            userBooker,
            to,
            status: 'confirmed',
            isAvailable: false
        });

        // Save the meeting document to the database
        const savedMeeting = await newMeeting.save();

        // Return success response
        res.status(201).json({
            success: true,
            message: 'Meeting created successfully',
            data: savedMeeting
        });
    } catch (error) {
        console.error('Error creating meeting:', error); // Log the error
        res.status(500).json({
            success: false,
            message: 'Error creating meeting',
            error: error.message
        });
    }
};



exports.MeetingByDay = async (req, res) => {
    try {
        const { day } = req.query;

        let startDate;
        let endDate;

        // If no date is provided, use today's date
        if (day) {
            // Parse the provided date and set the start and end of the day
            startDate = startOfDay(parseISO(day)); // Start of the given day
            endDate = endOfDay(parseISO(day)); // End of the given day
        } else {
            // If no date is provided, use today's date
            startDate = startOfDay(new Date()); // Start of today
            endDate = endOfDay(new Date()); // End of today
        }

        // Query the database for meetings within the calculated date range
        const meetings = await Meeting.find({
            startTime: { $gte: formatISO(startDate), $lte: formatISO(endDate) }
        });

        // Return the filtered meetings in the response
        return res.json(meetings);
    } catch (error) {
        console.error("Error fetching meetings:", error);
        return res.status(500).json({ message: 'Server error while fetching meetings' });
    }
};
