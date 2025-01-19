import { Skeleton } from "@/components/ui/skeleton"

export default function BookingsLoading() {
  return (
    <div className="container mx-auto p-4">
      {/* Page Title */}
      <Skeleton className="h-8 w-48 mb-8 mx-auto" />
      
      {/* Bookings List */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
            {/* Booking Header */}
            <div className="flex justify-between mb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
            
            {/* Booking Details */}
            <div className="space-y-3 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            {/* Status and Actions */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 