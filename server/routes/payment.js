const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, bookingId } = req.body;
    
    const options = {
      amount: amount * 100, // amount in paisa
      currency: "INR",
      receipt: bookingId,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      orderId: order.id
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  try {
    const { bookingId, paymentId, orderId, signature } = req.body;
    
    // Verify signature
    const text = orderId + "|" + paymentId;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    if (generated_signature === signature) {
      // Update booking payment status
      await Booking.findByIdAndUpdate(bookingId, {
        paymentStatus: 'completed'
      });

      // Emit socket event for real-time update
      req.app.get('io').emit('paymentStatusUpdate', {
        bookingId,
        paymentStatus: 'completed'
      });

      res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      throw new Error('Invalid signature');
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

module.exports = router;