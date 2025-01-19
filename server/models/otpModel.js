const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true }, // Change email to phone
  password: { type: String }, // Optional if you want to keep a password for some features
  otp: { type: String }, // Store current OTP
  otpExpiry: { type: Date }, // Store OTP expiry time
});

module.exports = mongoose.model('User', UserSchema);