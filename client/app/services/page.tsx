"use client"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import Image from 'next/image'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { ShoppingCart } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'


// Update services data structure to include categories
const serviceCategories = [
  {
    id: 'switch',
    name: 'Switch & socket',
    icon: '/outlet.png',
    services: [
      {
        id: 1,
        name: 'Switchbox installation',
        price: 239,
        duration: '30 mins',
        description: 'Installed in specified area for new power outlet',
        image: '/switchbox.jpg'
      },
      {
        id: 2,
        name: 'AC switchbox installation',
        price: 249,
        duration: '30 mins',
        image: '/acplug.jpg'
      },
      {
        id: 3,
        name: 'Switchboard installation',
        price: 169,
        duration: '30 mins',
        description: 'Installed in existing wiring connections within the wall',
        image: '/switchboard.jpeg'
      }
    ]
  },
  {
    id: 'fan',
    name: 'Fan',
    icon: '/ceilingfan.jpg',
    services: [
      {
        id: 1,
        name: 'Fan uninstallation (ceiling/exhaust/wall)',
        price: 69,
        duration: '30 mins',
        image: '/fan.jpg'
      },
      {
        id: 2,
        name: 'Ceiling Fan Installation',
        price: 89,
        duration: '30 mins',
        image: '/fan.jpg'
      },
      {
        id: 3,
        name: 'Fan replacement (ceiling/exhaust/wall)',
        price: 149,
        duration: '30 mins',
        image: '/fan.jpg'
      },
      {
        id: 4,
        name: 'Fan repair (ceiling/exhaust/wall)',
        price: 109,
        duration: '30 mins',
        image: '/fan.jpg'
      },
      {
        id: 5,
        name: 'Fan regulator repair/replacement',
        price: 49,
        duration: '30 mins',
        image: '/regulator.png'
      },

    ]
  },
  {
    id: 'light',
    name: 'Light',
    icon: '/light.jpg',
    services: [
      {
        id: 1,
        name: 'Bulb/tubelight holder installation',
        price: 69,
        duration: '30 mins',
        image: '/holder.webp'
      },
      {
        id: 2,
        name: 'CFL to LED replacement',
        price: 129,
        duration: '30 mins',
        image: '/led.jpeg'
      },
      {
        id: 3,
        name: 'Decorative lights installation (per 5m)',
        price: 89,
        duration: '30 mins',
        image: '/decorative.jpg'
      },
      {
        id: 4,
        name: 'Decorative lights uninstallation (per 20m)',
        price: 99,
        duration: '30 mins',
        image: '/decorative.jpg'
      },
      {
        id: 6,
        name: 'Wall/ceiling light installation',
        price: 89,
        duration: '30 mins',
        image: '/wall.jpg'
      },

    ]
  },
  {
    id: 'doorbell',
    name: 'Doorbell',
    icon: '/doorbell1.jpg',
    services: [
      {
        id: 1,
        name: 'Doorbell Installation',
        price: 59,
        duration: '30 mins',
        image: '/doorbell1.jpg'
      },
      {
        id: 2,
        name: 'Doorbell Replacement',
        price: 79,
        duration: '30 mins',
        image: '/doorbell1.jpg'
      },
    ]
  },
  {
    id: 'ac',
    name: 'AC',
    icon: '/acc.jpg',
    services: [
      {
        id: 1,
        name: 'AC Installation',
        price: 239,
        duration: '30 mins',
        image: '/acinstall.avif'
      },
      {
        id: 2,
        name: 'AC Repair',
        price: 239,
        duration: '30 mins',
        image: '/acrepair.avif'
      },
    ]
  },
  {
    id: 'mcb',
    name: 'MCB',
    icon: '/breaker.png',
    services: [
      {
        id: 1,
        name: 'Single Phase MCB Installation',
        price: 99,
        duration: '30 mins',
        image: '/pngegg.png'
      },
      {
        id: 2,
        name: 'Double Phase MCB Installation',
        price: 149,
        duration: '30 mins',
        image: '/doublemcb.jpg'
      },
      {
        id: 3,
        name: 'MCB/Fuse Replacement',
        price: 89,
        duration: '30 mins',
        image: '/fuse.jpg'
      },
      {
        id: 4,
        name: 'Submeter Installation',
        price: 219,
        duration: '30 mins',
        image: '/meter.jpg'
      },
      {
        id: 5,
        name: '3-Phase changeover switch installation',
        price: 89,
        duration: '30 mins',
        image: '/changeover.webp'
      },
    ]
  },
  {
    id: 'inverter',
    name: 'Inverter',
    icon: '/inverter.jpg',
    services: [
      {
        id: 1,
        name: 'Inverter Installation',
        price: 349,
        duration: '30 mins',
        image: '/inverter.webp'
      },
      {
        id: 2,
        name: 'Stabilizer Installation',
        price: 109,
        duration: '30 mins',
        image: '/inverter.jpg'
      },
      {
        id: 3,
        name: 'Inverter Repair',
        price: 199,
        duration: '30 mins',
        image: '/inverter.webp'
      },
      {
        id: 4,
        name: 'Inverter Battery Replacement',
        price: 199,
        duration: '30 mins',
        image: '/battery.webp'
      },
      {
        id: 5,
        name: 'Inverter Servicing',
        price: 139,
        duration: '30 mins',
        image: '/inverter.webp'
      },
      {
        id: 6,
        name: 'Inverter Fuse Replacement',
        price: 99,
        duration: '30 mins',
        image: '/inverterfuse.webp'
      },
    ]
  },
  
  {
    id: 'wiring-installation',
    name: 'Wiring Installation',
    icon: '/wiring.jpg',
    services: [
      {
        id: 1,
        name: 'External Wiring Installation',
        price: 199,
        duration: '30 mins',
        image: '/wiring.jpg'
      },
      {
        id: 2,
        name: 'Internal Wiring Installation',
        price: 149,
        duration: '30 mins',
        image: '/wiring.jpg'
      },
    ]
  },
  {
    id: 'appliance-installation',
    name: 'Appliance Installation',
    icon: '/install.jpg',
    services: [
      {
        id: 1,
        name: 'TV Installation',
        price: 379,
        duration: '30 mins',
        image: '/tv.avif'
      },
      {
        id: 2,
        name: 'CCTV Camera Installation',
        price: 239,
        duration: '30 mins',
        image: '/cctv.avif'
      },
      {
        id: 3,
        name: 'Microwave Installation',
        price: 239,
        duration: '30 mins',
        image: '/mw.avif'
      },
      {
        id: 4,
        name: 'Washing Machine Installation',
        price: 279,
        duration: '30 mins',
        image: '/washing.avif'
      },
      {
        id: 5,
        name: 'Refrigerator Installation',
        price: 299,
        duration: '30 mins',
        image: '/fridge.avif'
      },
      {
        id: 6,
        name: 'TV Uninstallation',
        price: 129,
        duration: '30 mins',
        image: '/tv.avif'
      },
      {
        id: 7,
        name: 'Geyser Installation',
        price: 399,
        duration: '30 mins',
        image: '/geyser.avif'
      },
    ]
  },
  {
    id: 'Book a Visit',
    name: 'Book a Visit',
    icon: '/electrician.avif',
    services: [
      {
        id: 1,
        name: 'Book a Visit',
        price: 149,
        duration: '30 mins',
        image: '/electrician.avif'
      },
    ]
  }

]

// Add a type for the service
type Service = {
  id: number | string
  categoryId?: string
  name: string
  price: number
  duration: string
  description?: string
  image: string
}

// Add near the top of the file with other type definitions
type SelectedService = {
  service: Service
  quantity: number
}

// Add this near your other type definitions
type BookingResponse = {
  success: boolean;
  message: string;
  booking?: any;
}

export default function ServicesPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter();

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [category])

  // Add this filtered categories calculation
  const filteredCategories = category 
    ? serviceCategories.filter(cat => cat.id === category)
    : serviceCategories

  const addToCart = (service: Service, quantity: number) => {
    // Get existing cart data
    const existingData = localStorage.getItem('checkoutServices')
    let cartData = existingData ? JSON.parse(existingData) : { services: [], totalAmount: 0 }

    // Check if service already exists in cart
    const existingServiceIndex = cartData.services.findIndex(
      (item: any) => item.service.id === service.id && item.service.categoryId === service.categoryId
    )

    if (existingServiceIndex >= 0) {
      // Increment quantity if service exists
      cartData.services[existingServiceIndex].quantity += quantity
    } else {
      // Add new service if it doesn't exist
      cartData.services.push({ service, quantity })
    }

    // Recalculate total amount
    cartData.totalAmount = cartData.services.reduce(
      (total: number, item: any) => total + (item.service.price * item.quantity),
      0
    )

    // Save updated cart data
    localStorage.setItem('checkoutServices', JSON.stringify(cartData))
    
    // Update the selectedServices state to reflect the cart
    setSelectedServices(cartData.services)
    
    toast.success('Added to cart')
  }

  const removeFromCart = (serviceId: number | string, categoryId: string) => {
    const updatedServices = selectedServices.filter(item => 
      !(item.service.id === serviceId && item.service.categoryId === categoryId)
    )
    
    setSelectedServices(updatedServices)
    
    // Update localStorage
    const cartData = {
      services: updatedServices,
      totalAmount: updatedServices.reduce(
        (total, item) => total + (item.service.price * item.quantity),
        0
      )
    }
    localStorage.setItem('checkoutServices', JSON.stringify(cartData))
  }

  // Add this useEffect to check login status and clear cart if logged out
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      // Clear cart data if user is not logged in
      localStorage.removeItem('checkoutServices');
      setSelectedServices([]);
    }
  }, []); // Empty dependency array means this runs once on component mount

  // Modify the existing cart loading useEffect to check for login status
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const existingData = localStorage.getItem('checkoutServices');
      if (existingData) {
        const cartData = JSON.parse(existingData);
        setSelectedServices(cartData.services);
      }
    }
  }, []);

  const totalAmount = selectedServices.reduce(
    (sum, item) => sum + (item.service.price * item.quantity), 
    0
  )

  const handleCheckout = async () => {
    const userEmail = localStorage.getItem('userData') 
      ? JSON.parse(localStorage.getItem('userData')!).email 
      : null;

    if (!userEmail) {
      toast.error('Please login first');
      return;
    }

    // Store selected services in localStorage for the checkout page
    localStorage.setItem('checkoutServices', JSON.stringify({
      services: selectedServices,
      totalAmount: totalAmount
    }));

    // Navigate to checkout page
    router.push('/checkout');
  };

  return (
    <div className="relative">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl hover:bg-gray-100 p-2 rounded-full transition-colors">←</Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Electrician</h1>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)} className="hover:bg-gray-100 rounded-full relative">
              <ShoppingCart className="h-5 w-5" />
              {selectedServices.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center animate-bounce">
                  {selectedServices.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Categories Skeleton */}
        <div className="w-1/4 border-r pr-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            {isLoading ? (
              // Skeleton for categories
              Array(12).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 p-3">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            ) : (
              // Existing categories content
              serviceCategories.map((cat) => (
                <Link 
                  href={`/services?category=${cat.id}`} 
                  key={cat.id}
                >
                  <Card className={`flex flex-col items-center gap-2 p-4 transition-all hover:shadow-md transform hover:-translate-y-1 ${
                    category === cat.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                  }`}>
                    <div className="relative h-10 w-10">
                      <Image
                        src={cat.icon}
                        alt={cat.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-sm font-medium text-center text-gray-700">{cat.name}</h3>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Services Skeleton */}
        <div className="w-3/4 pl-6">
          {isLoading ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-48" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="border rounded-lg overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Skeleton className="h-6 w-48 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full mt-4" />
                      <Skeleton className="h-10 w-full mt-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Existing services content
            category && filteredCategories.map((cat) => (
              <div key={cat.id} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-8 w-8">
                  </div>
                  <h2 className="text-2xl font-bold">{cat.name}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cat.services.map((service) => {
                    // Add categoryId to the service object
                    const serviceWithCategory = {
                      ...service,
                      categoryId: cat.id
                    };
                    
                    return (
                      <Card key={service.id} className="overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
                        <div className="relative h-40 w-40 mx-auto my-4 rounded-xl overflow-hidden">
                          <Image
                            src={service.image}
                            alt={service.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-contain hover:scale-105 transition-transform duration-300"
                            priority={false}
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg mb-1 text-gray-800">{service.name}</h3>
                              <div className="flex items-center gap-2 text-gray-500">
                                <span className="inline-block">⏱️</span>
                                <span className="text-sm">{service.duration}</span>
                              </div>
                            </div>
                            <p className="font-bold text-xl text-blue-600">₹{service.price}</p>
                          </div>
                          {service.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                          )}
                          <Button 
                            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                            onClick={() => addToCart(serviceWithCategory, 1)}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-[400px]">
          <SheetHeader>
            <SheetTitle>Selected Services</SheetTitle>
          </SheetHeader>
          <div className="mt-8">
            {selectedServices.map((item) => (
              <div key={item.service.id} className="flex justify-between items-center py-4 border-b">
                <div>
                  <h4 className="font-medium">{item.service.name}</h4>
                  <p className="text-sm text-gray-500">₹{item.service.price} x {item.quantity}</p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => removeFromCart(item.service.id, item.service.categoryId!)}
                >
                  Remove
                </Button>
              </div>
            ))}
            {selectedServices.length > 0 ? (
              <div className="mt-8">
                <div className="flex justify-between font-bold mb-4">
                  <span>Total Amount:</span>
                  <span>₹{totalAmount}</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                No services added yet
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}


