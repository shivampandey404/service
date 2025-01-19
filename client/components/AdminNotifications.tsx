'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import io from 'socket.io-client'
import axios from 'axios'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

// Configure axios and socket.io
axios.defaults.baseURL = 'https://service-backend-1iq4.onrender.com'
const socket = io('https://service-backend-1iq4.onrender.com')

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

export default function AdminNotifications() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState<string>('')
  const [isReplying, setIsReplying] = useState(false)
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null)

  useEffect(() => {
    // Listen for new bookings
    socket.on('newBooking', (data) => {
      toast.success(`New booking received from ${data.notification.email}`)
      fetchBookings()
    })

    // Listen for booking removals
    socket.on('bookingRemoved', (data) => {
      setBookings(prevBookings => 
        prevBookings.filter(booking => booking._id !== data.bookingId)
      )
      toast.success('Completed booking has been archived')
    })

    fetchBookings()

    return () => {
      socket.off('newBooking')
      socket.off('bookingRemoved')
      socket.disconnect()
    }
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/admin/bookings')
      if (response.data.success) {
        setBookings(response.data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    setUpdatingBookingId(bookingId);
    try {
      const response = await axios.put(`/api/bookings/${bookingId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        socket.emit('bookingStatusUpdate', {
          bookingId,
          status: newStatus
        });
        
        if (newStatus === 'rejected') {
          toast.success('Booking rejected and customer notified via email');
        } else {
          toast.success(`Booking ${newStatus} successfully`);
        }
        
        // If the booking is completed, schedule it for removal
        if (newStatus === 'completed') {
          await scheduleBookingRemoval(bookingId);
        }
        
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const scheduleBookingRemoval = async (bookingId: string) => {
    try {
      await axios.post(`/api/bookings/${bookingId}/schedule-removal`);
    } catch (error) {
      console.error('Error scheduling booking removal:', error);
    }
  };

  const handlePaymentStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const response = await axios.put(`/api/bookings/${bookingId}/payment-status`, {
        paymentStatus: newStatus
      });

      if (response.data.success) {
        // Emit socket event for real-time update
        socket.emit('paymentStatusUpdate', {
          bookingId,
          paymentStatus: newStatus
        });
        
        toast.success(`Payment status updated to ${newStatus}`);
        fetchBookings(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const handleReply = async (bookingId: string) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setIsReplying(true);
    try {
      const response = await axios.post(`https://service-backend-1iq4.onrender.com/api/admin/bookings/${bookingId}/reply`, {
        reply: replyText,
        bookingId: bookingId
      });

      if (response.data.success) {
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === bookingId
              ? { ...booking, adminReply: replyText }
              : booking
          )
        );
        
        // Emit socket event for real-time update
        socket.emit('adminReply', {
          bookingId,
          reply: replyText
        });
        
        toast.success('Reply sent successfully');
        setReplyText('');
      } else {
        throw new Error(response.data.message || 'Failed to send reply');
      }
    } catch (error: any) {
      console.error('Reply error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reply');
    } finally {
      setIsReplying(false);
    }
  };

  // Add socket listener for reply updates
  useEffect(() => {
    socket.on('adminReplyUpdate', (data) => {
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === data.bookingId
            ? { ...booking, adminReply: data.reply }
            : booking
        )
      );
    });

    return () => {
      socket.off('adminReplyUpdate');
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((booking) => (
          <Card key={booking._id} className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">Customer: {booking.customerName}</h3>
                  <p className="text-sm text-gray-500">Email: {booking.customerEmail}</p>
                  <p className="text-sm text-gray-500">Phone: {booking.customerPhone}</p>
                  <p className="text-sm text-gray-500">Address: {booking.address}</p>
                  <p className="text-sm text-gray-500">Pincode: {booking.pincode}</p>
                  <p className="text-sm text-gray-500">
                    Scheduled: {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
                  </p>
                  <p className="text-sm text-gray-500">Payment Method: {booking.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Booking ID: {booking._id}</p>
                  <p className="text-sm text-gray-500">
                    Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-2 border-t pt-2">
                <h4 className="font-medium mb-1">Services:</h4>
                {booking.services.map((service, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{service.serviceName} x{service.quantity}</span>
                    <span>₹{service.totalPrice}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 font-semibold flex justify-between">
                  <span>Total Amount:</span>
                  <span>₹{booking.totalAmount}</span>
                </div>
              </div>

              <div className="flex justify-between mt-2">
                <p className={`text-sm ${
                  booking.status === 'completed' ? 'text-green-600' : 
                  booking.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  Status: {booking.status}
                </p>
                <p className={`text-sm ${
                  booking.paymentStatus === 'completed' ? 'text-green-600' : 
                  booking.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  Payment: {booking.paymentStatus}
                </p>
              </div>

              <div className="flex justify-between mt-4 border-t pt-4">
                <div className="space-x-2">
                  <Button
                    onClick={() => handleStatusUpdate(booking._id, 'accepted')}
                    disabled={booking.status !== 'pending' || updatingBookingId === booking._id}
                    className={`${
                      booking.status === 'accepted' ? 'bg-green-600' : 'bg-blue-600'
                    } text-white px-4 py-2 rounded`}
                  >
                    {updatingBookingId === booking._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Accept'
                    )}
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                    disabled={booking.status !== 'pending' || updatingBookingId === booking._id}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    {updatingBookingId === booking._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Reject'
                    )}
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(booking._id, 'completed')}
                    disabled={booking.status !== 'accepted' || updatingBookingId === booking._id}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    {updatingBookingId === booking._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Complete'
                    )}
                  </Button>

                  {/* Reply Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="ml-2"
                      >
                        {booking.adminReply ? 'Update Reply' : 'Reply to Customer'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reply to Booking #{booking._id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Your Reply
                          </label>
                          <Textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Enter your reply to the customer..."
                            className="min-h-[100px]"
                          />
                        </div>
                        <Button
                          onClick={() => handleReply(booking._id)}
                          disabled={isReplying || !replyText.trim()}
                          className="w-full"
                        >
                          {isReplying ? (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Sending...</span>
                            </div>
                          ) : (
                            'Send Reply'
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Display existing reply */}
                {booking.adminReply && (
                  <div className="mt-2 bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-600">Previous Reply:</p>
                    <p className="text-sm text-gray-600">{booking.adminReply}</p>
                  </div>
                )}

                <div className="space-x-2">
                  <Button
                    onClick={() => handlePaymentStatusUpdate(booking._id, 'completed')}
                    disabled={booking.paymentStatus === 'completed'}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Mark Paid
                  </Button>
                  <Button
                    onClick={() => handlePaymentStatusUpdate(booking._id, 'pending')}
                    disabled={booking.paymentStatus === 'pending'}
                    className="bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    Mark Pending
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
} 
