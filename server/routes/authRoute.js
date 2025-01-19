const express = require('express');
const { requestOtp, verifyOtp } = require('../controllers/authController');

const router = express.Router();

router.post('/request-otp', requestOtp); // Request OTP
router.post('/verify-otp', verifyOtp); // Verify OTP and login

module.exports = router;