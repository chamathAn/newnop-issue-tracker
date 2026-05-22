import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton({ rows = 7 }: { rows?: number }) {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="p-3 border-b bg-muted/30">
        <div className="grid grid-cols-7 gap-4">
          {['200px', '80px', '80px', '80px', '100px', '80px', '60px'].map((w, i) => (
            <Skeleton key={i} className="h-4" style={{ width: w }} />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-3 border-b last:border-b-0">
          <div className="grid grid-cols-7 gap-4 items-center">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
