"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';
import { loadStripe } from '@stripe/stripe-js';

// Configure axios and socket.io
axios.defaults.baseURL = 'https://service-backend-1iq4.onrender.com';
const socket = io('https://service-backend-1iq4.onrender.com');

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Booking {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  pincode: string;
  scheduledDate: string;
  scheduledTime: string;
  paymentMethod: string;
  services: Array<{
    serviceName: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }>;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  adminReply?: string;
}

interface PaymentDetails {
  upiId?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
          toast.error('Please login to view bookings');
          router.push('/login');
          return;
        }

        const userData = JSON.parse(userDataStr);
        const userEmail = userData.email;

        if (!userEmail) {
          toast.error('User email not found');
          router.push('/login');
          return;
        }

        const response = await axios.get(`/api/bookings/${userEmail}`);
        if (response.data.success) {
          setBookings(response.data.bookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    // Listen for new bookings
    socket.on('newBooking', (data) => {
      fetchBookings(); // Refresh the bookings list
      toast.success('New booking created!');
    });

    // Listen for booking status updates
    socket.on('bookingStatusUpdate', (data) => {
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === data.bookingId 
            ? { ...booking, status: data.status }
            : booking
        )
      );

      const statusMessages = {
        accepted: 'Your booking has been accepted!',
        rejected: 'Sorry, technician is not available at this time. Please try booking for a different time slot.',
        completed: 'Your service has been completed!'
      };
      
      if (data.status === 'rejected') {
        toast.error(statusMessages.rejected);
      } else {
        toast.success(statusMessages[data.status as keyof typeof statusMessages] || 
          `Booking status updated to ${data.status}`);
      }
    });

    // Listen for payment status updates
    socket.on('paymentStatusUpdate', (data) => {
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === data.bookingId 
            ? { ...booking, paymentStatus: data.paymentStatus }
            : booking
        )
      );

      const paymentMessages = {
        completed: 'Payment has been marked as completed!',
        pending: 'Payment has been marked as pending.',
        failed: 'Payment has been marked as failed.'
      };
      
      toast(paymentMessages[data.paymentStatus as keyof typeof paymentMessages] || 
        `Payment status updated to ${data.paymentStatus}`);
    });

    fetchBookings();

    // Cleanup function
    return () => {
      socket.off('newBooking');
      socket.off('bookingStatusUpdate');
      socket.off('paymentStatusUpdate');
      socket.disconnect();
    };
  }, [router]);

  const handlePayment = async (booking: Booking) => {
    setSelectedBooking(booking);
    
    if (booking.paymentMethod === 'cod') {
      // Handle COD
      try {
        await axios.post(`/api/payments/cod/${booking._id}`);
        toast.success('Cash on delivery payment confirmed');
      } catch (error) {
        toast.error('Failed to confirm COD payment');
      }
      return;
    }

    setShowPaymentModal(true);
  };

  const handleUPIPayment = async () => {
    if (!selectedBooking || !paymentDetails.upiId) return;

    try {
      const response = await axios.post(`/api/payments/upi/${selectedBooking._id}`, {
        upiId: paymentDetails.upiId
      });

      if (response.data.success) {
        toast.success('UPI payment initiated');
        setShowPaymentModal(false);
      }
    } catch (error) {
      toast.error('UPI payment failed');
    }
  };

  const handleCardPayment = async () => {
    if (!selectedBooking) return;

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      // Create payment method first
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: {
          token: paymentDetails.cardNumber!
        },
      });

      if (!paymentMethod) throw new Error('Failed to create payment method');

      // Create payment intent
      const response = await axios.post(`/api/payments/create-intent/${selectedBooking._id}`);
      const { clientSecret } = response.data;

      // Confirm payment with the payment method
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === 'succeeded') {
        toast.success('Payment successful');
        setShowPaymentModal(false);
      }
    } catch (error: any) {
      toast.error(error.message || 'Payment failed');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        {/* Title Skeleton */}
        <div className="h-8 bg-gray-200 rounded-md w-48 mb-6 animate-pulse" />
        
        {/* Loading Bubbles */}
        <div className="flex justify-center space-x-2 mb-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-primary rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>

        {/* Booking Card Skeletons */}
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start">
                {/* Left Side Skeleton */}
                <div className="space-y-3 flex-1">
                  {/* Booking ID */}
                  <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
                  
                  {/* Booking Details */}
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                    ))}
                  </div>

                  {/* Services */}
                  <div className="mt-4 space-y-2">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
                    ))}
                  </div>
                </div>

                {/* Right Side Skeleton */}
                <div className="text-right space-y-3">
                  {/* Total Amount */}
                  <div className="h-5 bg-gray-200 rounded w-24 ml-auto animate-pulse" />
                  
                  {/* Status */}
                  <div className="h-4 bg-gray-100 rounded w-20 ml-auto animate-pulse" />
                  
                  {/* Payment Status */}
                  <div className="h-4 bg-gray-100 rounded w-28 ml-auto animate-pulse" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <p>No bookings found</p>
        ) : (
          bookings.map((booking) => (
            <Card key={booking._id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Booking ID: {booking._id}</h3>
                  <p className="text-sm text-gray-500">
                    Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Scheduled: {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
                  </p>
                  <p className="text-sm text-gray-500">Address: {booking.address}</p>
                  <p className="text-sm text-gray-500">Pincode: {booking.pincode}</p>
                  <p className="text-sm text-gray-500">Payment Method: {booking.paymentMethod}</p>
                  <div className="mt-2">
                    {booking.services.map((service, index) => (
                      <div key={index} className="text-sm">
                        {service.serviceName} x{service.quantity} - ₹{service.totalPrice}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">Total: ₹{booking.totalAmount}</p>
                  <div className="mt-2">
                    <p className={`text-sm ${
                      booking.status === 'completed' ? 'text-green-600' : 
                      booking.status === 'accepted' ? 'text-blue-600' :
                      booking.status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      Status: {booking.status === 'rejected' ? 'Technician not available' : booking.status}
                    </p>
                    {booking.status === 'rejected' && (
                      <p className="text-sm text-gray-500 mt-1">
                        Please try booking for a different time slot
                      </p>
                    )}
                  </div>
                  <p className={`text-sm ${
                    booking.paymentStatus === 'completed' ? 'text-green-600' : 
                    booking.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    Payment: {booking.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Admin Reply Section */}
              {booking.adminReply && (
                <div className="mt-4 bg-blue-50 p-4 rounded-md w-full">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">
                    Message from Service Provider:
                  </h4>
                  <p className="text-sm text-gray-700">
                    {booking.adminReply}
                  </p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Payment for Booking {selectedBooking._id}
            </h2>
            
            {selectedBooking.paymentMethod === 'upi' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">UPI ID</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Enter UPI ID"
                    onChange={(e) => setPaymentDetails({ upiId: e.target.value })}
                  />
                </div>
                <button
                  className="w-full bg-primary text-white p-2 rounded"
                  onClick={handleUPIPayment}
                >
                  Pay with UPI
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    placeholder="Card number"
                    onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder="MM/YY"
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CVV</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      placeholder="CVV"
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                    />
                  </div>
                </div>
                <button
                  className="w-full bg-primary text-white p-2 rounded"
                  onClick={handleCardPayment}
                >
                  Pay with Card
                </button>
              </div>
            )}
            
            <button
              className="w-full mt-4 bg-gray-200 p-2 rounded"
              onClick={() => setShowPaymentModal(false)}
            >
              Cancel
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
