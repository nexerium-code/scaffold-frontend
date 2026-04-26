import { Skeleton } from '@/components/ui/skeleton';

export default function WorkshopSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-24" />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                {[...Array(3)].map((_, idx) => (
                    <Skeleton key={idx} className="h-32 w-full rounded-lg" />
                ))}
            </div>
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-96" />
                <Skeleton className="h-8 w-32" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, idx) => (
                    <Skeleton key={idx} className="h-32 w-full rounded-lg" />
                ))}
            </div>
        </div>
    );
}
