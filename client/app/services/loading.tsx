import { Skeleton } from "@/components/ui/skeleton"

export default function ServicesLoading() {
  return (
    <div className="container mx-auto p-4">
      {/* Page Title Skeleton */}
      <Skeleton className="h-8 w-48 mb-8 mx-auto" />
      
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
            {/* Service Image Skeleton */}
            <Skeleton className="w-full h-48 mb-4" />
            
            {/* Service Title */}
            <Skeleton className="h-6 w-3/4 mb-3" />
            
            {/* Service Description */}
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            
            {/* Price */}
            <Skeleton className="h-5 w-24 mb-4" />
            
            {/* Button */}
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
} 