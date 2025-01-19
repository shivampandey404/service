const mongoose = require('mongoose');

const serviceBookingSchema = new mongoose.Schema({
    userId: String,
    customerName: String,
    customerEmail: String,
    customerPhone: String,
    address: String,
    pincode: String,
    scheduledDate: String,
    scheduledTime: String,
    services: [{
        serviceId: String,
        serviceName: String,
        quantity: Number,
        price: Number,
        totalPrice: Number
    }],
    totalAmount: Number,
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'cod'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ServiceBooking', serviceBookingSchema); 