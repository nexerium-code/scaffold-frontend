import { Skeleton } from "@/components/ui/skeleton";

type TableSkeletonProps = {
    small?: boolean;
};

function TableSkeleton({ small = false }: TableSkeletonProps) {
    return (
        <div className="flex flex-col gap-4">
            {!small && <Skeleton className="h-8 w-96 max-w-full" />}
            {[...Array(10)].map((_, idx) => (
                <Skeleton key={idx} className="h-10 w-full rounded-lg" />
            ))}
        </div>
    );
}

export default TableSkeleton;
