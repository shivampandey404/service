'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Menu, X } from 'lucide-react';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function Header() {
  const [showLoginSheet, setShowLoginSheet] = useState(false)
  const [showEmailSheet, setShowEmailSheet] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const [userData, setUserData] = useState<{
    email: string;
    name?: string;
    phone?: string;
    id?: string;
  } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginClick = () => {
    setShowLoginSheet(true)
  }

  const handleBookingsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowLoginSheet(true)
  }

  // const handleEmailSubmit = async () => {
  //   if (!email) {
  //     toast.error('Please enter your email');
  //     return;
  //   }

  //   setIsLoading(true);
  //   try {
  //     const response = await axios.post("http://localhost:5000/api/generate-otp", { email });
  //     console.log('OTP Generation Response:', response.data); // Debug log
      
  //     if (response.data.success) {
  //       setShowEmailSheet(false);
  //       setShowLoginSheet(true);
  //       toast.success('OTP sent to your email');
  //     }
  //   } catch (error: any) {
  //     console.error('OTP Generation Error:', error); // Debug log
  //     const errorMessage = error?.response?.data?.message || 'Failed to send OTP';
  //     toast.error(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  const handleContinue = async () => {
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("https://service-backend-1iq4.onrender.com/api/generate-otp", { email });
      console.log('OTP Generation Response:', response.data); // Debug log
      
      if (response.data.success) {
        setShowLoginSheet(false);
        setShowEmailSheet(true);
        toast.success('Please check your email for OTP');
      }
    } catch (error: any) {
      console.error('OTP Generation Error:', error); // Debug log
      const errorMessage = error?.response?.data?.message || 'Failed to send OTP';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("https://service-backend-1iq4.onrender.com/api/verify-otp", { email, otp });
      if (response.data.success) {
        const userData = {
          ...response.data.user,
          isAdmin: response.data.user.isAdmin || false
        };
        setUserData(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setShowEmailSheet(false);
        setIsLoggedIn(true);
        setIsAdmin(userData.isAdmin);
        setOtp('');
        setEmail('');
        toast.success('Successfully logged in!');
        localStorage.setItem('isLoggedIn', 'true');

        if (userData.isAdmin) {
          toast.success('Welcome, Admin!');
        }
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to verify OTP';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Simulate logout delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUserData(null);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  }

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    const storedUserData = localStorage.getItem('userData');
    
    if (loginStatus === 'true') {
      setIsLoggedIn(true);
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    }
  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const userData = localStorage.getItem('userData')
      console.log('UserData from localStorage:', userData) // Debug log

      if (!userData) {
        console.log('No user data found') // Debug log
        return
      }

      const { email } = JSON.parse(userData)
      console.log('Checking admin status for email:', email) // Debug log

      const isAdminUser = email === ADMIN_EMAIL;
      console.log('Is admin user:', isAdminUser) // Debug log
      setIsAdmin(isAdminUser)
    }

    if (isLoggedIn) {
      checkAdminStatus()
    }
  }, [isLoggedIn])

  console.log('Current isAdmin state:', isAdmin) // Debug log

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="text-2xl font-bold text-blue-600 transition-colors duration-200 hover:text-blue-700">
              PRK Service Group
            </Link>

            <button
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 rounded-md hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-200 rotate-0" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-200 rotate-0" />
              )}
            </button>

            <div 
              className={`w-full lg:w-auto flex flex-col lg:flex-row lg:items-center gap-4
                overflow-hidden transition-all duration-300 ease-in-out
                ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 lg:max-h-[500px] opacity-0 lg:opacity-100'}
                lg:overflow-visible lg:transition-none`}
            >
              <nav className="flex-1">
                <ul className="flex flex-col lg:flex-row gap-4 lg:items-center">
                  <li>
                    <Link 
                      href="/" 
                      className="text-gray-600 hover:text-blue-600 block py-2 lg:py-0 transition-all duration-200 
                        hover:translate-x-1 lg:hover:translate-x-0 hover:bg-gray-50 lg:hover:bg-transparent px-2 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/services" 
                      className="text-gray-600 hover:text-blue-600 block py-2 lg:py-0 transition-all duration-200 
                        hover:translate-x-1 lg:hover:translate-x-0 hover:bg-gray-50 lg:hover:bg-transparent px-2 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/about" 
                      className="text-gray-600 hover:text-blue-600 block py-2 lg:py-0 transition-all duration-200 
                        hover:translate-x-1 lg:hover:translate-x-0 hover:bg-gray-50 lg:hover:bg-transparent px-2 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About Us
                    </Link>
                  </li>
                  {isLoggedIn && (
                    <li>
                      <Link 
                        href="/bookings" 
                        className="text-gray-600 hover:text-blue-600 block py-2 lg:py-0 transition-all duration-200 
                          hover:translate-x-1 lg:hover:translate-x-0 hover:bg-gray-50 lg:hover:bg-transparent px-2 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                    </li>
                  )}
                  {isAdmin && userData?.email === ADMIN_EMAIL && (
                    <li>
                      <Link 
                        href="/admin" 
                        className="text-gray-600 hover:text-blue-600 block py-2 lg:py-0 transition-all duration-200 
                          hover:translate-x-1 lg:hover:translate-x-0 hover:bg-gray-50 lg:hover:bg-transparent px-2 rounded"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>

              <div className="lg:ml-4 transition-transform duration-200">
                {!isLoggedIn ? (
                  <Button 
                    variant="outline" 
                    onClick={handleLoginClick}
                    className="w-full lg:w-auto transition-all duration-200 hover:scale-105"
                  >
                    Log In
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full lg:w-auto min-w-[80px] transition-all duration-200 hover:scale-105"
                  >
                    {isLoggingOut ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>...</span>
                      </div>
                    ) : (
                      'Log Out'
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <Sheet open={showLoginSheet} onOpenChange={setShowLoginSheet}>
        <SheetContent side="right" className="w-[400px]">
          <SheetHeader>
            <SheetTitle>Login</SheetTitle>
            <SheetDescription>
              Enter your email to receive an OTP.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your email"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleContinue}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Continue'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={showEmailSheet} onOpenChange={setShowEmailSheet}>
        <SheetContent side="right" className="w-[400px]">
          <SheetHeader>
            <SheetTitle>Enter OTP</SheetTitle>
            <SheetDescription>
              Enter the OTP sent to your email.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter OTP"
                />
              </div>
              <Button
                onClick={handleVerifyOTP}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

