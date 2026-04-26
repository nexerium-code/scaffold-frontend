import { useTranslation } from "react-i18next";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetWorkshopsStats } from "@/hooks/workshop/useGetWorkshopsStats";
import { cn } from "@/lib/utils";

type EnrolleesApprovedChartProps = {
    eventId: string;
    className?: string;
};

function EnrolleesApprovedChart({ eventId, className }: EnrolleesApprovedChartProps) {
    const { t } = useTranslation();
    const { stats, loading: loadingStats, isError: isErrorStats } = useGetWorkshopsStats(eventId);

    const chartConfig = {
        progress: { label: t("approved"), color: "var(--chart-2)" },
        remaining: { label: t("remaining"), color: "var(--chart-5)" }
    } satisfies ChartConfig;

    if (loadingStats) return <Skeleton className="h-[530px] w-full" />;

    if (isErrorStats || stats?.workshopCount === 0) {
        return (
            <Empty className="h-[535px] w-full border border-dashed">
                <EmptyHeader>
                    <EmptyTitle>{t("no-data")}</EmptyTitle>
                    <EmptyDescription>{t("workshops-data-not-found")}</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    const registeredCount = stats?.enrolleeCount || 0;
    const approvedCount = stats?.approvedEnrolleeCount || 0;
    const percentage = registeredCount > 0 ? Math.round((approvedCount / registeredCount) * 100) : 0;
    const remaining = 100 - percentage;

    const chartData = [{ progress: percentage, remaining }];

    return (
        <Card className="gap-0 rounded-md py-0 shadow-none">
            <CardHeader className="flex flex-col items-stretch border-b p-0!">
                <div className="flex flex-1 flex-col justify-center gap-1 p-6 pb-4">
                    <CardTitle>{t("analytics-workshops")}</CardTitle>
                    <CardDescription>{t("analytics-workshops-description")}</CardDescription>
                </div>
                <div className="flex">
                    <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 even:border-s">
                        <span className="text-muted-foreground text-xs">{t("registered")}</span>
                        <span className="text-lg leading-none font-bold sm:text-3xl">{registeredCount}</span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 even:border-s">
                        <span className="text-muted-foreground text-xs">{t("approved")}</span>
                        <span className="text-lg leading-none font-bold sm:text-3xl">{approvedCount}</span>
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
                                                    {t("approved")}
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

export default EnrolleesApprovedChart;
