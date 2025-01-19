const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    services: [{
        name: String,
        price: Number,
        quantity: Number,
        bookingDate: {
            type: Date,
            default: Date.now
        }
    }],
    totalAmount: Number,
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Notification', NotificationSchema); 