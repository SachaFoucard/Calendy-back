const Meeting = require('../Models/model_meeting');
const moment = require('moment'); // For easier date manipulation, use moment.js or native JS Date methods
const { parseISO, startOfDay, endOfDay, formatISO, endOfWeek } = require('date-fns');


exports.weeklyMeetings = async (req, res) => {
    try {
        const { date } = req.query; // Optional query parameter for an ISO date
        console.log('Requested date:', date);

        let startDate, endDate;

        if (!date) {
            // Use today's date
            startDate = startOfDay(new Date()); // Start of today
            endDate = endOfWeek(new Date()); // End of the current week
        } else {
            // Provided date is used
            const providedDate = parseISO(date); // Parse the provided date as ISO
            startDate = startOfDay(providedDate); // Start of the provided date
            endDate = endOfWeek(providedDate); // End of the week for the provided date
        }

        // Query the database for meetings within the calculated date range
        const meetings = await Meeting.find({
            startTime: { $gte: formatISO(startDate), $lte: formatISO(endDate) },
        });

        res.status(200).json(meetings); // Send the meetings as a response
    } catch (error) {
        console.error('Error retrieving meetings:', error);
        res.status(500).json({ message: 'Error retrieving meetings', error: error.message });
    }
};

exports.createMeetings = async (req, res) => {
    try {
        const { customerName, customerMail, title, startTime, endTime, userBooker, to, id } = req.body;

        // Check if there are any existing meetings that overlap with the requested start and end times
        const existingMeeting = await Meeting.findOne({
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }, // Overlaps with the requested time range
                { startTime: { $lt: startTime }, endTime: { $gt: endTime } }  // Overlaps with the requested time range
            ]
        });

        if (existingMeeting) {
            return res.status(400).json({
                success: false,
                message: 'The requested time slot is already taken'
            });
        }

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
