const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// BookingService Schema
const BookingServiceSchema = new Schema({
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

// Booking Schema
const BookingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  services: [BookingServiceSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'upi', 'cod']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'completed', 'cancelled']
  },
  address: {
    type: Object,
    required: true
  },
  scheduledFor: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Create and export the model
module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);