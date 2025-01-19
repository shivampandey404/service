"use client"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useState, useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const categories = [
  { 
    id: 1,
    name: 'AC',
    icon: '/acc.jpg',
    description: 'Air Conditioner'
  },
  { 
    id: 2, 
    name: 'Fan',
    icon: '/fan.jpg',
    description: 'Complete fan installation and repair services'
  },
  { 
    id: 3, 
    name: 'Light',
    icon: '/light.jpg',
    description: 'Complete light installation and repair services'
  },
  { 
    id: 4, 
    name: 'Doorbell',
    icon: '/doorbell1.jpg',
    description: 'Complete doorbell installation and repair services'
  },

  // Add more categories as needed
]

function LoadingEffect() {
  return (
    <div className="flex justify-center items-center space-x-2 min-h-screen">
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
    </div>
  )
}

function ServiceCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-full h-48 mb-4" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Auto-play functionality
  useEffect(() => {
    if (emblaApi) {
      const interval = setInterval(() => {
        emblaApi.scrollNext()
      }, 3000) // Slides every 3 seconds

      setAutoplayInterval(interval)

      // Pause auto-play on hover/touch
      const onPointerDown = () => {
        if (autoplayInterval) clearInterval(autoplayInterval)
      }

      const onPointerUp = () => {
        const interval = setInterval(() => {
          emblaApi.scrollNext()
        }, 3000)
        setAutoplayInterval(interval)
      }

      emblaApi.on('pointerDown', onPointerDown)
      emblaApi.on('pointerUp', onPointerUp)

      return () => {
        clearInterval(interval)
        emblaApi.off('pointerDown', onPointerDown)
        emblaApi.off('pointerUp', onPointerUp)
      }
    }
  }, [emblaApi])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const handleCategoryClick = (categoryId: number) => {
    const selectedCategory = categories[categoryId - 1];
    router.push(`/services?category=${selectedCategory.name.toLowerCase().replace(' & ', '-')}`);
  }

  // Add loading effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500) // Show loading for 1.5 seconds

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingEffect />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {[1, 2, 3].map((i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Expert Electrician Services at Your Fingertips</h1>
        <p className="text-xl text-gray-600 mb-8">Book professional electricians for all your electrical needs</p>
        <Button size="lg" asChild>
          <Link href="/services">Explore Our Services</Link>
        </Button>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8 text-center">Featured Categories</h2>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {categories.map((category) => (
                <div key={category.id} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_33.33%] px-4">
                  <Card 
                    className="cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <CardHeader>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <img 
                        src={category.icon}
                        alt={category.name} 
                        className="w-full h-48 object-cover rounded-md mb-3" 
                      />
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      <section className="text-center mb-16">
        <h2 className="text-3xl font-semibold mb-4">Why Choose RK Service?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Expert Technicians</h3>
            <p className="text-gray-600">Our electricians are certified and experienced professionals</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Quality Service</h3>
            <p className="text-gray-600">We ensure high-quality work and customer satisfaction</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Affordable Pricing</h3>
            <p className="text-gray-600">Competitive rates without compromising on quality</p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 mb-8">Book your service now and experience hassle-free electrical solutions</p>
        <Button size="lg" asChild>
          <Link href="/services">Book a Service</Link>
        </Button>
      </section>
    </div>
  )
}

