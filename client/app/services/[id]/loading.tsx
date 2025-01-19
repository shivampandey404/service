import { Skeleton } from "@/components/ui/skeleton"

export default function ServiceLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-[250px] mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Skeleton className="w-full h-[400px] rounded-lg mb-4" />
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <div>
          <Skeleton className="h-8 w-[200px] mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-8 w-[300px] mb-2" />
          <div className="space-y-2 mb-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
          <Skeleton className="h-8 w-[200px] mb-2" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 