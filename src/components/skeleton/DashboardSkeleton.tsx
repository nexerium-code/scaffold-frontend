import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-32" />
                <div className="hidden gap-4 lg:flex">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-32" />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Skeleton className="h-[445px] w-full" />
                <Skeleton className="h-[445px] w-full" />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
                <Skeleton className="h-[530px] w-full" />
                <Skeleton className="h-[530px] w-full" />
                <Skeleton className="h-[530px] w-full" />
                <Skeleton className="h-[530px] w-full" />
            </div>
        </div>
    );
}
