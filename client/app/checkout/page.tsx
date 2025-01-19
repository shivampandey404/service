"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import axios from 'axios'

type CheckoutData = {
  services: any[]
  totalAmount: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pincode: '',
    date: '',
    time: ''
  })

  useEffect(() => {
    const savedCheckoutData = localStorage.getItem('checkoutServices')
    if (!savedCheckoutData) {
      router.push('/services')
      return
    }

    // Parse the saved data
    const parsedData = JSON.parse(savedCheckoutData)
    setCheckoutData(parsedData)
  }, [router])

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user is logged in by looking for userData in localStorage
    const userData = localStorage.getItem('userData')
    if (!userData) {
      toast.error('Please login to continue')
      router.push('/login')
      return
    }

    try {
      const userEmail = JSON.parse(userData).email
      // Instead of directly making the booking, redirect to payment page with form data
      const bookingData = {
        email: userEmail,
        services: checkoutData?.services,
        ...formData
      }
      
      // Save booking data temporarily
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData))
      
      // Redirect to payment page
      router.push('/payment')
    } catch (error: any) {
      toast.error('Something went wrong. Please try again.')
    }
  }

  if (!checkoutData) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Name</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block mb-2">Phone</label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label className="block mb-2">Address</label>
              <Input
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div>
              <label className="block mb-2">Pincode</label>
              <Input
                required
                value={formData.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
              />
            </div>

            <div>
              <label className="block mb-2">Date</label>
              <Input
                required
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div>
              <label className="block mb-2">Preferred Time</label>
              <select
                required
                className="w-full px-3 py-2 border rounded-md"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" className="w-full">
              Continue to Payment
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {checkoutData.services.map((item) => (
              <div key={item.service.id} className="flex justify-between">
                <span>{item.service.name} x{item.quantity}</span>
                <span>₹{item.service.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t pt-4 font-bold flex justify-between">
              <span>Total Amount:</span>
              <span>₹{checkoutData.totalAmount}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 