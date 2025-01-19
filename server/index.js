require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./databse');
const nodemailer = require('nodemailer');
const User = require('./models/userModel');
const ServiceBooking = require('./models/serviceBookingModel');
const http = require('http');
const { Server } = require('socket.io');
const Notification = require('./models/notificationModel');

// Initialize Express
const app = express();


// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Your Next.js client URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Connect to Database
connectDB();

// OTP Schema and Model
const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expiresAt: Date,
});

const Otp = mongoose.model('Otp', otpSchema);

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Generate OTP Endpoint
app.post('/api/generate-otp', async (req, res) => {
    const { email } = req.body;

    console.log('Received request to generate OTP for email:', email);

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Valid for 5 minutes

    try {
        console.time('Save OTP to DB');
        // Save OTP to the database
        await Otp.findOneAndUpdate(
            { email },
            { otp, expiresAt },
            { upsert: true, new: true }
        );
        console.timeEnd('Save OTP to DB');

        console.time('Send OTP via email');
        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            console.timeEnd('Send OTP via email');
            if (error) {
                console.error('Error sending OTP:', error);
                return res.status(500).json({ success: false, message: 'Failed to send OTP.' });
            }
            console.log('Email sent:', info.response);
            res.json({ success: true, message: 'OTP sent successfully.' });
        });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to generate OTP.' });
    }
});

// Replace the hardcoded admin email with environment variable
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Verify OTP Endpoint
app.post('/api/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpDoc = await Otp.findOne({ email });
        
        if (!otpDoc || otpDoc.otp !== otp || otpDoc.expiresAt < new Date()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
        }

        // Find or create user with admin check
        let user = await User.findOne({ email });
        if (!user) {
            // Set isAdmin true only for kumarraushan04702@gmail.com
            user = await User.create({ 
                email,
                isAdmin: email === process.env.ADMIN_EMAIL
            });
        }

        // Delete used OTP
        await Otp.deleteOne({ email });

        res.json({
            success: true,
            message: 'OTP verified successfully.',
            user: {
                email: user.email,
                isAdmin: user.isAdmin,
                name: user.name,
                phone: user.phone,
                id: user._id
            }
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to verify OTP.' });
    }
});

// Add endpoint to update user profile
app.post('/api/update-profile', async (req, res) => {
    const { email, name, phone } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { 
                name,
                phone
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.json({ 
            success: true, 
            message: 'Profile updated successfully.',
            user: {
                email: updatedUser.email,
                name: updatedUser.name,
                phone: updatedUser.phone
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Failed to update profile.' });
    }
});

// Add endpoint to get user profile
app.get('/api/user-profile/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Add debug log
        console.log('Found user:', user);

        res.json({ 
            success: true, 
            user: {
                email: user.email,
                name: user.name,
                phone: user.phone,
                isVerified: user.isVerified,
                isAdmin: user.isAdmin || false  // Explicitly include isAdmin
            }
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
    }
});

// Add this new endpoint
app.post('/api/book-services', async (req, res) => {
    const { email, services } = req.body;
    
    console.log('Received booking request:', { email, services });

    if (!email || !services) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and services are required.' 
        });
    }

    try {
        // Create the booking
        const booking = await ServiceBooking.findOneAndUpdate(
            { email },
            { 
                $push: { 
                    services: { 
                        $each: services 
                    } 
                } 
            },
            { upsert: true, new: true }
        );

        // Calculate total amount
        const totalAmount = services.reduce((sum, service) => 
            sum + (service.price * service.quantity), 0
        );

        // Create notification for admin
        const notification = await Notification.create({
            email,
            services,
            totalAmount,
            status: 'pending'
        });

        // If you have Socket.IO set up, emit the notification
        if (io) {
            io.emit('newBooking', { 
                notification,
                message: `New booking from ${email}`
            });
        }

        res.json({ 
            success: true, 
            message: 'Services booked successfully',
            booking
        });
    } catch (error) {
        console.error('Error booking services:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to book services.' 
        });
    }
});

// Add endpoint to get all notifications
app.get('/api/admin/notifications', async (req, res) => {
    try {
        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .limit(50);
        res.json({ success: true, notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch notifications' 
        });
    }
});

// Add endpoint to mark notification as read
app.put('/api/admin/notifications/:id', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        res.json({ success: true, notification });
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update notification' 
        });
    }
});

// Add this endpoint to set admin status (protect this in production!)
app.post('/api/set-admin', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { email },
            { isAdmin: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.json({ 
            success: true, 
            message: 'Admin status updated successfully',
            user: {
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error('Error updating admin status:', error);
        res.status(500).json({ success: false, message: 'Failed to update admin status.' });
    }
});

// Add this function after the transporter configuration
const sendBookingEmail = async (bookingDetails) => {
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: ADMIN_EMAIL,
    subject: 'New Service Booking',
    html: `
      <h2>New Service Booking Details</h2>
      <p><strong>Customer Name:</strong> ${bookingDetails.customerName}</p>
      <p><strong>Customer Email:</strong> ${bookingDetails.customerEmail}</p>
      <p><strong>Customer Phone:</strong> ${bookingDetails.customerPhone}</p>
      <p><strong>Address:</strong> ${bookingDetails.address}</p>
      <p><strong>Pincode:</strong> ${bookingDetails.pincode}</p>
      <p><strong>Scheduled Date:</strong> ${bookingDetails.scheduledDate}</p>
      <p><strong>Scheduled Time:</strong> ${bookingDetails.scheduledTime}</p>
      <p><strong>Payment Method:</strong> ${bookingDetails.paymentMethod}</p>
      <h3>Services Booked:</h3>
      <ul>
        ${bookingDetails.services.map(service => `
          <li>
            ${service.serviceName} - Quantity: ${service.quantity} - Price: ₹${service.price}
            (Total: ₹${service.totalPrice})
          </li>
        `).join('')}
      </ul>
      <p><strong>Total Amount:</strong> ₹${bookingDetails.totalAmount}</p>
      <p><strong>Payment Status:</strong> ${bookingDetails.paymentStatus}</p>
      <p><strong>Booking Status:</strong> ${bookingDetails.status}</p>
    `
  };

  const customerMailOptions = {
    from: process.env.EMAIL_USER,
    to: bookingDetails.customerEmail,
    subject: 'Your Service Booking Confirmation',
    html: `
      <h2>Booking Confirmation</h2>
      <p>Dear ${bookingDetails.customerName},</p>
      <p>Thank you for booking our services. Here are your booking details:</p>
      <p><strong>Scheduled Date:</strong> ${bookingDetails.scheduledDate}</p>
      <p><strong>Scheduled Time:</strong> ${bookingDetails.scheduledTime}</p>
      <h3>Services Booked:</h3>
      <ul>
        ${bookingDetails.services.map(service => `
          <li>${service.serviceName} - Quantity: ${service.quantity}</li>
        `).join('')}
      </ul>
      <p><strong>Total Amount:</strong> ₹${bookingDetails.totalAmount}</p>
      <p><strong>Payment Method:</strong> ${bookingDetails.paymentMethod}</p>
      <p>We will contact you shortly to confirm your booking.</p>
      <p>Thank you for choosing our services!</p>
    `
  };

  try {
    // Send email to admin
    await transporter.sendMail(adminMailOptions);
    console.log('Admin notification email sent');

    // Send confirmation email to customer
    await transporter.sendMail(customerMailOptions);
    console.log('Customer confirmation email sent');

    return true;
  } catch (error) {
    console.error('Error sending emails:', error);
    return false;
  }
};

// Add this function after the existing sendBookingEmail function
const sendRejectionEmail = async (booking) => {
  const customerMailOptions = {
    from: process.env.EMAIL_USER,
    to: booking.customerEmail,
    subject: 'Booking Rejection Notification',
    html: `
      <h2>Booking Rejection Notice</h2>
      <p>Dear ${booking.customerName},</p>
      <p>We regret to inform you that your service booking has been rejected due to technician unavailability.</p>
      
      <h3>Booking Details:</h3>
      <p><strong>Booking ID:</strong> ${booking._id}</p>
      <p><strong>Scheduled Date:</strong> ${booking.scheduledDate}</p>
      <p><strong>Scheduled Time:</strong> ${booking.scheduledTime}</p>
      
      <h3>Services Requested:</h3>
      <ul>
        ${booking.services.map(service => `
          <li>${service.serviceName} - Quantity: ${service.quantity}</li>
        `).join('')}
      </ul>
      
      <p>Please try booking for a different time slot. We apologize for any inconvenience caused.</p>
      
      <p>Best regards,<br>PRK Service Group</p>
    `
  };

  try {
    await transporter.sendMail(customerMailOptions);
    console.log('Rejection email sent to customer');
    return true;
  } catch (error) {
    console.error('Error sending rejection email:', error);
    return false;
  }
};

// Update the booking endpoint to include email notifications
app.post('/api/bookings', async (req, res) => {
  console.log('Received booking request:', req.body);
    
  try {
    // Create a new booking in the database
    const booking = await ServiceBooking.create({
      userId: req.body.userId,
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone,
      address: req.body.address,
      pincode: req.body.pincode,
      scheduledDate: req.body.scheduledDate,
      scheduledTime: req.body.scheduledTime,
      services: req.body.services,
      totalAmount: req.body.totalAmount,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: req.body.paymentStatus,
      status: req.body.status,
    });

    // Send email notifications
    await sendBookingEmail(booking);

    // Create notification for admin
    const notification = await Notification.create({
      email: req.body.customerEmail,
      services: req.body.services,
      totalAmount: req.body.totalAmount,
      status: 'pending',
      scheduledDate: req.body.scheduledDate,
      scheduledTime: req.body.scheduledTime
    });

    // Emit socket event for real-time updates
    if (io) {
      io.emit('newBooking', { 
        notification,
        message: `New booking from ${req.body.customerEmail}`
      });
    }

    res.json({ 
      success: true, 
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create booking',
      error: error.message
    });
  }
});

// Add endpoint to get user's bookings
app.get('/api/bookings/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const bookings = await ServiceBooking.find({ customerEmail: email })
            .sort({ createdAt: -1 });

        res.json({ 
            success: true, 
            bookings 
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch bookings' 
        });
    }
});

// Add endpoint to get all bookings for admin
app.get('/api/admin/bookings', async (req, res) => {
    try {
        const bookings = await ServiceBooking.find()
            .sort({ createdAt: -1 });

        res.json({ 
            success: true, 
            bookings 
        });
    } catch (error) {
        console.error('Error fetching admin bookings:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch bookings' 
        });
    }
});

// Add endpoint to update booking status
app.put('/api/bookings/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const booking = await ServiceBooking.findById(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        booking.status = status;
        await booking.save();

        // Send rejection email if status is 'rejected'
        if (status === 'rejected') {
            await sendRejectionEmail(booking);
        }

        // Emit socket event for real-time updates
        if (io) {
            io.emit('bookingStatusUpdate', {
                bookingId: id,
                status,
                customerEmail: booking.customerEmail
            });
        }

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            booking
        });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status'
        });
    }
});

// Add endpoint to update payment status
app.put('/api/bookings/:id/payment-status', async (req, res) => {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    try {
        const booking = await ServiceBooking.findByIdAndUpdate(
            id,
            { paymentStatus },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Emit socket event for real-time updates
        if (io) {
            io.emit('paymentStatusUpdate', {
                bookingId: id,
                paymentStatus,
                customerEmail: booking.customerEmail
            });
        }

        res.json({
            success: true,
            message: 'Payment status updated successfully',
            booking
        });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update payment status'
        });
    }
});

// Add endpoint to schedule booking removal
app.post('/api/bookings/:id/schedule-removal', async (req, res) => {
    const { id } = req.params;
    const REMOVAL_DELAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    try {
        // Schedule the booking for removal
        setTimeout(async () => {
            try {
                // Move booking to archive collection
                const booking = await ServiceBooking.findById(id);
                if (booking && booking.status === 'completed') {
                    // Create archive entry
                    await mongoose.model('ArchivedBooking').create({
                        ...booking.toObject(),
                        archivedAt: new Date(),
                        originalId: booking._id
                    });

                    // Remove from active bookings
                    await ServiceBooking.findByIdAndDelete(id);

                    // Emit socket event for UI update
                    if (io) {
                        io.emit('bookingRemoved', {
                            bookingId: id,
                            message: 'Booking archived'
                        });
                    }
                }
            } catch (error) {
                console.error('Error removing booking:', error);
            }
        }, REMOVAL_DELAY);

        res.json({
            success: true,
            message: 'Booking scheduled for removal'
        });
    } catch (error) {
        console.error('Error scheduling booking removal:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to schedule booking removal'
        });
    }
});

// Create ArchivedBooking model
const archivedBookingSchema = new mongoose.Schema({
    ...ServiceBooking.schema.obj,  // Copy the existing booking schema
    archivedAt: { type: Date, default: Date.now },
    originalId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceBooking' }
});

mongoose.model('ArchivedBooking', archivedBookingSchema);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Admin connected');

    socket.on('disconnect', () => {
        console.log('Admin disconnected');
    });
});

// Add cancellation email function
const sendCancellationEmail = async (booking) => {
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'Booking Cancellation Notice',
    html: `
      <h2>Booking Cancellation Notice</h2>
      <p>A booking has been cancelled by the customer.</p>
      
      <h3>Booking Details:</h3>
      <p><strong>Booking ID:</strong> ${booking._id}</p>
      <p><strong>Customer:</strong> ${booking.customerName}</p>
      <p><strong>Email:</strong> ${booking.customerEmail}</p>
      <p><strong>Scheduled Date:</strong> ${booking.scheduledDate}</p>
      <p><strong>Scheduled Time:</strong> ${booking.scheduledTime}</p>
      <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
    `
  };

  const customerMailOptions = {
    from: process.env.EMAIL_USER,
    to: booking.customerEmail,
    subject: 'Booking Cancellation Confirmation',
    html: `
      <h2>Booking Cancellation Confirmation</h2>
      <p>Dear ${booking.customerName},</p>
      <p>Your booking has been successfully cancelled as per your request.</p>
      
      <h3>Cancelled Booking Details:</h3>
      <p><strong>Booking ID:</strong> ${booking._id}</p>
      <p><strong>Scheduled Date:</strong> ${booking.scheduledDate}</p>
      <p><strong>Scheduled Time:</strong> ${booking.scheduledTime}</p>
      
      <p>We hope to serve you again in the future.</p>
      <p>Best regards,<br>PRK Service Group</p>
    `
  };

  try {
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);
    return true;
  } catch (error) {
    console.error('Error sending cancellation emails:', error);
    return false;
  }
};

// Add cancellation endpoint
app.post('/api/bookings/:id/cancel', async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await ServiceBooking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Only allow cancellation of pending or accepted bookings
    if (booking.status !== 'pending' && booking.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this booking in its current status'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Send cancellation emails
    await sendCancellationEmail(booking);

    // Emit socket event for real-time updates
    if (io) {
      io.emit('bookingStatusUpdate', {
        bookingId: id,
        status: 'cancelled',
        message: 'Booking cancelled by customer'
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking'
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});