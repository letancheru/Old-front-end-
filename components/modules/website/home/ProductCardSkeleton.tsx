import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
  count?: number;
  variant?: "default" | "compact";
}

export default function ProductCardSkeleton({ 
  className, 
  count = 1,
  variant = "default" 
}: ProductCardSkeletonProps) {
  const renderSkeletonCard = () => (
    <div className={cn(
      "relative flex flex-col justify-between items-center h-full border border-gray-200 rounded-lg bg-white shadow-sm p-4",
      variant === "compact" && "p-2",
      className
    )}>
      <Skeleton className="h-[180px] w-full rounded-lg bg-gray-200" />
      <Skeleton className="h-6 w-3/4 mt-4 rounded-md bg-gray-300" />
      <Skeleton className="h-4 w-20 mt-2 rounded-md bg-gray-400" />
      <Skeleton className="h-6 w-1/3 mt-4 rounded-md bg-gray-500" />
      <Skeleton className="h-10 w-3/4 mt-4 rounded-full bg-gray-600" />
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeletonCard()}
        </div>
      ))}
    </div>
  );
} 