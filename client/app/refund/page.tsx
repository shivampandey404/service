"use client"
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function RefundPolicyPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Title Skeleton */}
        <div className="h-8 bg-gray-200 rounded-md w-3/4 mx-auto mb-6 animate-pulse" />
        
        <Card className="p-8">
          {/* Last Updated Skeleton */}
          <div className="h-4 bg-gray-100 rounded w-48 mb-6 animate-pulse" />

          {/* Introduction Skeleton */}
          <div className="space-y-3 mb-8">
            <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
          </div>

          {/* Policy Points Skeletons */}
          <div className="space-y-6">
            {/* Loading Bubbles */}
            <div className="flex justify-center space-x-2 mb-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-primary rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>

            {/* Section Skeletons */}
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                {/* Section Title Skeleton */}
                <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
                
                {/* Content Skeletons */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Contact Section Skeleton */}
            <div className="mt-8 bg-primary/5 p-6 rounded-lg">
              <div className="h-5 bg-gray-200 rounded w-32 mb-3 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Original content component (your existing JSX)
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Cancellation & Refund Policy</h1>
      
      <Card className="p-8">
        <div className="prose prose-slate max-w-none">
          {/* Last Updated Notice */}
          <div className="text-sm text-gray-500 mb-6">
            Last updated on 17-01-2025 00:15:46
          </div>

          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-700">
              RAUSHAN KUMAR believes in helping its customers as far as possible, and has therefore a liberal
              cancellation policy. Under this policy:
            </p>
          </div>

          {/* Policy Points */}
          <div className="space-y-6">
            {/* Cancellation Policy */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-primary">Cancellation Terms</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-gray-700">
                    Cancellations will be considered only if the request is made immediately after placing the order.
                    However, the cancellation request may not be entertained if the orders have been communicated to the
                    vendors/merchants and they have initiated the process of shipping them.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-gray-700">
                    RAUSHAN KUMAR does not accept cancellation requests for perishable items like flowers, eatables
                    etc. However, refund/replacement can be made if the customer establishes that the quality of product
                    delivered is not good.
                  </p>
                </div>
              </div>
            </div>

            {/* Damaged/Defective Items */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-primary">Damaged or Defective Items</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-gray-700">
                    <p>
                      In case of receipt of damaged or defective items please report the same to our Customer Service team.
                      The request will, however, be entertained once the merchant has checked and determined the same at his
                      own end.
                    </p>
                    <div className="mt-2 bg-yellow-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-yellow-800">
                        Important: This should be reported within the same day of receipt of the products.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-gray-700">
                    In case you feel that the product received is not as shown on the site or as per your expectations,
                    you must bring it to the notice of our customer service within the same day of receiving the product.
                    The Customer Service Team after looking into your complaint will take an appropriate decision.
                  </p>
                </div>
              </div>
            </div>

            {/* Warranty & Refund Processing */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-primary">Warranty & Refund Processing</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <AlertCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-gray-700">
                    <p>
                      In case of complaints regarding products that come with a warranty from manufacturers, please refer
                      the issue to them.
                    </p>
                    <div className="mt-2 bg-blue-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-blue-800">
                        Note: In case of any Refunds approved by RAUSHAN KUMAR, it'll take 3-5 days for the refund to be
                        processed to the end customer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-8 bg-primary/5 p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
              <p className="text-gray-700">
                For any queries regarding our cancellation and refund policy, please contact our customer service team:
              </p>
              <div className="mt-2">
                <a href="tel:+918804921967" className="text-primary hover:underline">
                  +91 8804921967
                </a>
                <br />
                <a href="mailto:kumarraushan04702@gmail.com" className="text-primary hover:underline">
                  kumarraushan04702@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}