import { Skeleton } from '@/components/ui/skeleton';

export default function PlaceholderSkeleton() {
    return (
        <div className="space-y-4 p-4">
            {[...Array(10)].map((_, idx) => (
                <Skeleton key={idx} className="h-8 w-full rounded-lg" />
            ))}
        </div>
    );
}
