'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import AdminNotifications from '@/components/AdminNotifications'

const ADMIN_EMAIL = 'kumarraushan04702@gmail.com';

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuthorization = () => {
      const userData = localStorage.getItem('userData')
      if (!userData) {
        toast.error('Please login first')
        router.push('/')
        return
      }

      const { email } = JSON.parse(userData)
      if (email !== ADMIN_EMAIL) {
        toast.error('Unauthorized access')
        router.push('/')
        return
      }

      setIsAuthorized(true)
    }

    checkAuthorization()
  }, [router])

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          {/* Admin content here */}
          <AdminNotifications />
        </div>
      </div>
    </div>
  )
}
