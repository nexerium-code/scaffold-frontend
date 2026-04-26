import { Skeleton } from "@/components/ui/skeleton";

function ResourceSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <Skeleton className="h-10 w-72 max-w-full" />
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-32 w-full rounded-md" />
                <Skeleton className="h-32 w-full rounded-md" />
            </div>
            <Skeleton className="h-40 w-full rounded-md" />
        </div>
    );
}

export default ResourceSkeleton;
