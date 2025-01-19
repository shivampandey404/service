"use client"
import React, { useState, useEffect } from 'react';
import { CreditCard, Smartphone, Wallet } from 'lucide-react';
import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PaymentMethod = 'card' | 'upi' | 'cod';

interface Service {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface BookingData {
  userId?: string;
  name: string;
  email: string;
  phone: string;
  services: Service[];
}

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

function App() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Mock booking data for demonstration
    setBookingData({
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      services: [
        { id: "1", name: "Service 1", price: 1000, quantity: 1 },
        { id: "2", name: "Service 2", price: 500, quantity: 2 }
      ]
    });
  }, []);

  const calculateTotal = (services: Service[]) => {
    return services.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePayment = async () => {
    if (!bookingData) return;
    
    setIsProcessing(true);
    try {
      if (selectedMethod === 'cod') {
        const response = await axios.post('/api/bookings', {
          ...bookingData,
          paymentMethod: 'cod',
          paymentStatus: 'pending'
        });
        
        if (response.data.success) {
          alert('Booking confirmed successfully!');
        }
        return;
      }

      const orderResponse = await axios.post('/api/payments/create-order', {
        amount: calculateTotal(bookingData.services)
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: calculateTotal(bookingData.services) * 100,
        currency: "INR",
        name: "Your Business Name",
        description: "Service Booking Payment",
        order_id: orderResponse.data.orderId,
        handler: async (response: any) => {
          await axios.post('/api/payments/verify', {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
          alert('Payment successful!');
        },
        prefill: {
          name: bookingData.name,
          email: bookingData.email,
          contact: bookingData.phone
        },
        theme: {
          color: "#6366f1"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.response?.data?.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }

  };
  if (!bookingData) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Payment</h1>
          <p className="mt-2 text-gray-600">Choose your preferred payment method below</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
              
              <div className="space-y-4">
                {[
                  { id: 'card', icon: CreditCard, title: 'Credit/Debit Card', desc: 'Pay securely with your card' },
                  { id: 'upi', icon: Smartphone, title: 'UPI', desc: 'Pay using UPI' },
                  { id: 'cod', icon: Wallet, title: 'Cash on Delivery', desc: 'Pay when service is delivered' }
                ].map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedMethod === method.id 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-indigo-200'
                    }`}
                    onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        selectedMethod === method.id ? 'bg-indigo-100' : 'bg-gray-100'
                      }`}>
                        <method.icon className={`w-6 h-6 ${
                          selectedMethod === method.id ? 'text-indigo-600' : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{method.title}</h3>
                        <p className="text-sm text-gray-500">{method.desc}</p>
                      </div>
                      <div className="flex items-center h-5">
                        <input
                          type="radio"
                          checked={selectedMethod === method.id}
                          onChange={() => setSelectedMethod(method.id as PaymentMethod)}
                          className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : `Pay ₹${calculateTotal(bookingData.services)}`}
              </button>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {bookingData.services.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="font-semibold text-gray-900">
                      ₹{calculateTotal(bookingData.services)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;