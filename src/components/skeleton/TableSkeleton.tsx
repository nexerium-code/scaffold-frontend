import { Skeleton } from '@/components/ui/skeleton';

type TableSkeletonProps = {
    small?: boolean;
};

export default function TableSkeleton({ small = false }: TableSkeletonProps) {
    return (
        <div className="space-y-4">
            {!small && <Skeleton className="h-8 w-96" />}
            {[...Array(10)].map((_, idx) => (
                <Skeleton key={idx} className="h-10 w-full rounded-lg" />
            ))}
        </div>
    );
}
