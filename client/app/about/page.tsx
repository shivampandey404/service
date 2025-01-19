import Link from 'next/link'

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About PRK Service</h1>
      <p className="text-lg text-gray-700 mb-4">
        PRK Service provides professional electrician services for your home and office needs. Our team of experienced electricians is dedicated to delivering high-quality services to ensure the safety and functionality of your electrical systems.
      </p>
      <p className="text-lg text-gray-700 mb-4">
        We offer a wide range of services including installation, repair, and maintenance of electrical systems. Whether you need a new switchboard installed, a ceiling fan repaired, or a complete wiring overhaul, we have the expertise to get the job done right.
      </p>
      <p className="text-lg text-gray-700 mb-4">
        At PRK Service, customer satisfaction is our top priority. We strive to provide prompt and reliable services at competitive prices. Our electricians are trained to handle all types of electrical issues with professionalism and efficiency.
      </p>
      <p className="text-lg text-gray-700 mb-4">
        Contact us today to learn more about our services or to schedule an appointment. We look forward to serving you!
      </p>
      <div className="mt-8">
        <Link href="/contact" className="text-blue-600 hover:underline">
          Contact Us
        </Link>
      </div>
    </div>
  )
}