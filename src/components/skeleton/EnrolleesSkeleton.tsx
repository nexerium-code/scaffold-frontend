import { Skeleton } from '@/components/ui/skeleton';

export default function EnrolleesSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-8 w-96" />
            {[...Array(10)].map((_, idx) => (
                <Skeleton key={idx} className="h-10 w-full rounded-lg" />
            ))}
        </div>
    );
}
