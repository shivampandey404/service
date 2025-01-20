"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import Image from 'next/image'
import Script from 'next/script'

declare global {
  interface Window {
    Razorpay: any;
  }
}

type PaymentMethod = 'card' | 'upi' | 'cod'

axios.defaults.baseURL = 'https://service-da95.onrender.com'
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default function PaymentPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<any>(null)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const pendingBooking = localStorage.getItem('pendingBooking')
    if (!pendingBooking) {
      router.push('/checkout')
      return
    }
    setBookingData(JSON.parse(pendingBooking))
  }, [router])

  const handlePayment = async () => {
    setIsProcessing(true)
    try {
      const bookingDetails = {
        paymentMethod: selectedMethod,
        paymentStatus: selectedMethod === 'cod' ? 'pending' : 'completed',
        status: 'pending',
        userId: bookingData.userId || '',
        customerName: bookingData.name,
        customerEmail: bookingData.email,
        customerPhone: bookingData.phone,
        address: bookingData.address,
        pincode: bookingData.pincode,
        scheduledDate: bookingData.date,
        scheduledTime: bookingData.time,
        services: bookingData.services.map((item: any) => ({
          serviceId: item.service.id,
          serviceName: item.service.name,
          quantity: item.quantity,
          price: item.service.price,
          totalPrice: item.service.price * item.quantity
        })),
        totalAmount: bookingData.services.reduce(
          (total: number, item: any) => total + (item.service.price * item.quantity),
          0
        ),
      };

      if (selectedMethod === 'cod') {
        const response = await axios.post('/api/bookings', bookingDetails)
        if (response.data.success) {
          localStorage.removeItem('pendingBooking')
          localStorage.removeItem('checkoutServices')
          toast.success('Booking confirmed successfully!')
          router.push('/bookings')
        }
        return
      }

      // Create order
      const orderResponse = await axios.post('/api/payments/create-order', {
        amount: bookingDetails.totalAmount
      })

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: bookingDetails.totalAmount * 100,
        currency: "INR",
        name: "Your Business Name",
        order_id: orderResponse.data.orderId,
        handler: async (response: {
          razorpay_payment_id: string
          razorpay_order_id: string
          razorpay_signature: string
        }) => {
          // Verify payment
          await axios.post('/api/payments/verify', {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          })
        }      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.response?.data?.message || 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!bookingData) return null

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Payment</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
            
            <div className="space-y-4">
              <div
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedMethod === 'card' ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedMethod('card')}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={selectedMethod === 'card'}
                    onChange={() => setSelectedMethod('card')}
                  />
                  <Image 
                    src="/master.png" 
                    alt="Card payment"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <div>
                    <h3 className="font-semibold">Credit/Debit Card</h3>
                    <p className="text-sm text-gray-500">Pay securely with your card</p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedMethod === 'upi' ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedMethod('upi')}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={selectedMethod === 'upi'}
                    onChange={() => setSelectedMethod('upi')}
                  />
                  <Image 
                    src="/upi.svg" 
                    alt="UPI payment"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <div>
                    <h3 className="font-semibold">UPI</h3>
                    <p className="text-sm text-gray-500">Pay using UPI</p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedMethod === 'cod' ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedMethod('cod')}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={selectedMethod === 'cod'}
                    onChange={() => setSelectedMethod('cod')}
                  />
                  <Image 
                    src="/cod.png" 
                    alt="Cash on delivery"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <div>
                    <h3 className="font-semibold">Cash on Delivery</h3>
                    <p className="text-sm text-gray-500">Pay when service is delivered</p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-6"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay ₹${bookingData.services.reduce(
                (total: number, item: any) => total + (item.service.price * item.quantity),
                0
              )}`}
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {bookingData.services.map((item: any) => (
                <div key={item.service.id} className="flex justify-between">
                  <span>{item.service.name} x{item.quantity}</span>
                  <span>₹{item.service.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-4 font-bold flex justify-between">
                <span>Total Amount:</span>
                <span>₹{bookingData.services.reduce(
                  (total: number, item: any) => total + (item.service.price * item.quantity),
                  0
                )}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
