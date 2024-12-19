const { body } = require('express-validator');

// Validation middleware for meetings
const validateMeeting = [
    body('customerName').isString().notEmpty().withMessage('Customer name is required'),
    body('customerMail').isEmail().withMessage('Valid email is required'),
    body('title').isString().notEmpty().withMessage('Title is required'),
    body('startTime').isISO8601().withMessage('Start time must be a valid ISO date'),
    body('endTime').isISO8601().withMessage('End time must be a valid ISO date'),
    body('userBooker').isEmail().withMessage('Valid email for user booker is required'),
    body('to').isEmail().withMessage('Valid email for recipient is required')
];

module.exports = validateMeeting;