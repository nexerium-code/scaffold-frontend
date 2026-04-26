import { Skeleton } from "@/components/ui/skeleton";

function DashboardSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Skeleton className="h-10 w-64 max-w-full" />
                <Skeleton className="h-9 w-32" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, index) => (
                    <Skeleton key={index} className="h-28 w-full rounded-md" />
                ))}
            </div>
            <Skeleton className="h-72 w-full rounded-md" />
        </div>
    );
}

export default DashboardSkeleton;
