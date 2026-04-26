import { useTranslation } from "react-i18next";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAttendanceStats } from "@/hooks/attendance/useGetAttendanceStats";
import { cn } from "@/lib/utils";

type ExclusivesAttendedChartProps = {
    eventId: string;
    className?: string;
};

function ExclusivesAttendedChart({ eventId, className }: ExclusivesAttendedChartProps) {
    const { t } = useTranslation();
    const { stats, loading: loadingStats, isError: isErrorStats } = useGetAttendanceStats(eventId);

    const chartConfig = {
        progress: { label: t("attended"), color: "var(--chart-2)" },
        remaining: { label: t("remaining"), color: "var(--chart-5)" }
    } satisfies ChartConfig;

    if (loadingStats) return <Skeleton className="h-[530px] w-full" />;

    if (isErrorStats) {
        return (
            <Empty className="h-[535px] w-full border border-dashed">
                <EmptyHeader>
                    <EmptyTitle>{t("no-data")}</EmptyTitle>
                    <EmptyDescription>{t("exclusives-data-not-found")}</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    const createdCount = stats?.registeredExclusives || 0;
    const attendedCount = stats?.attendedExclusives || 0;
    const percentage = createdCount > 0 ? Math.round((attendedCount / createdCount) * 100) : 0;
    const remaining = 100 - percentage;

    const chartData = [{ progress: percentage, remaining }];

    return (
        <Card className="gap-0 rounded-md py-0 shadow-none">
            <CardHeader className="flex flex-col items-stretch border-b p-0!">
                <div className="flex flex-1 flex-col justify-center gap-1 p-6 pb-4">
                    <CardTitle>{t("analytics-exclusives")}</CardTitle>
                    <CardDescription>{t("analytics-exclusives-description")}</CardDescription>
                </div>
                <div className="flex">
                    <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 even:border-s">
                        <span className="text-muted-foreground text-xs">{t("created")}</span>
                        <span className="text-lg leading-none font-bold sm:text-3xl">{createdCount}</span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 even:border-s">
                        <span className="text-muted-foreground text-xs">{t("attended")}</span>
                        <span className="text-lg leading-none font-bold sm:text-3xl">{attendedCount}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className={cn("h-[300px] w-full", className)}>
                    <RadialBarChart data={chartData} startAngle={90} endAngle={-270} innerRadius="75%" outerRadius="120%">
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy || 0} className="fill-foreground text-4xl font-bold">
                                                    {percentage}%
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-sm">
                                                    {t("attended")}
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar dataKey="progress" stackId="a" fill="var(--color-progress)" />
                        <RadialBar dataKey="remaining" stackId="a" fill="var(--color-remaining)" />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default ExclusivesAttendedChart;
