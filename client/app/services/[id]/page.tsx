import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { services } from '@/app/data/services'

export default async function ServicePage({ params }: { params: { id: string } }) {
  // Add artificial delay to simulate loading (remove in production)
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const service = services.find(s => s.id === parseInt(params.id))

  if (!service) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={service.image} alt={service.name} className="w-full h-auto rounded-lg mb-4" />
          <p className="text-xl font-semibold mb-2">Starting from ₹{service.price}/hour</p>
          <Button size="lg" asChild>
            <Link href={`/book/${service.id}`}>Book Now</Link>
          </Button>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Service Description</h2>
          <p className="text-gray-700 mb-4">{service.description}</p>
          <h3 className="text-xl font-semibold mb-2">Why choose our {service.name} service?</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Experienced and certified technicians</li>
            <li>High-quality workmanship guaranteed</li>
            <li>Competitive and transparent pricing</li>
            <li>Flexible scheduling to fit your needs</li>
            <li>Flexible scheduling to fit your needs</li>
            <li>24/7 emergency service available</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">What to expect</h3>
          <ol className="list-decimal list-inside text-gray-700 mb-4">
            <li>Professional assessment of your electrical needs</li>
            <li>Upfront pricing with no hidden fees</li>
            <li>Skilled technicians arrive on time with all necessary equipment</li>
            <li>Thorough explanation of the work to be done</li>
            <li>Clean and efficient service delivery</li>
            <li>Follow-up to ensure your satisfaction</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

