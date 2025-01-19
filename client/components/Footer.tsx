import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About PRK Service Group</h3>
            <p className="text-sm text-gray-600">PRK Service Group provides professional electrician services for your home and office needs.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-blue-600">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600">Contact Us</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600">Terms of Service</Link></li>
              <li><Link href="/refund" className="text-sm text-gray-600 hover:text-blue-600">Cancellation & Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/services/fan" className="text-sm text-gray-600 hover:text-blue-600">Fan</Link></li>
              <li><Link href="/services/wiring-installation" className="text-sm text-gray-600 hover:text-blue-600">Wiring Installation</Link></li>
              <li><Link href="/services/appliance-installation" className="text-sm text-gray-600 hover:text-blue-600">Appliance Installation</Link></li>
              <li><Link href="/services/safety-inspection" className="text-sm text-gray-600 hover:text-blue-600">Book a Visit</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-blue-600">Facebook</a></li>
              <li><a href="https://www.instagram.com/prk_service_group?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="text-sm text-gray-600 hover:text-blue-600">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">&copy; 2023 PRK Service Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

