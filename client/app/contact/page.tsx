"use client"
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/contact', formData);
      if (response.data.success) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Contact Information Card */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Our Details</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Legal Entity Name</h3>
              <p>RAUSHAN KUMAR</p>
            </div>

            <div>
              <h3 className="font-semibold">Registered Address</h3>
              <p>Banni, Chapra, Bihar</p>
              <p>PIN: 841442</p>
            </div>

            <div>
              <h3 className="font-semibold">Operational Address</h3>
              <p>Banni, Chapra, Bihar</p>
              <p>PIN: 841442</p>
            </div>

            <div>
              <h3 className="font-semibold">Contact Information</h3>
              <p>
                <span className="font-medium">Phone: </span>
                <a href="tel:+918804921967" className="text-primary hover:underline">
                  +91 8804921967
                </a>
              </p>
              <p>
                <span className="font-medium">Email: </span>
                <a href="mailto:kumarraushan04702@gmail.com" className="text-primary hover:underline">
                  kumarraushan04702@gmail.com
                </a>
              </p>
            </div>

            <div className="text-sm text-gray-500">
              Last updated on 17-01-2025 00:14:35
            </div>
          </div>
        </Card>

        {/* Contact Form Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border rounded-md"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border rounded-md"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full p-2 border rounded-md"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </Card>
      </div>

      {/* Map Section */}
      <div className="mt-12 max-w-6xl mx-auto">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Our Location</h2>
          <div className="aspect-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14359.069967076964!2d84.72799!3d25.7777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3992c9f3342d7c75%3A0x5c7d6d4b8a38e047!2sBanni%2C%20Bihar%20841442!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}