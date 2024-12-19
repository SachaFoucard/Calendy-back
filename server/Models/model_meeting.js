
const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    customerMail: {
        type: String,
        required: true,
        trim: true,
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    userBooker: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    isAvailable: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    }
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;


