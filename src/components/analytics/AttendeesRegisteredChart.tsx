import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAttendanceStats } from "@/hooks/attendance/useGetAttendanceStats";
import { useUserAttendance } from "@/hooks/attendance/useUserAttendance";
import { useGetAllAttendees } from "@/hooks/attendees/useGetAllAttendees";
import { cn } from "@/lib/utils";
import { StructureAttendeesRegisteredChart } from "@/services/attendees/Attendees.helpers";

type AttendeesRegisteredChartProps = {
    eventId: string;
    className?: string;
};

function AttendeesRegisteredChart({ eventId, className }: AttendeesRegisteredChartProps) {
    const { t } = useTranslation();
    const { attendance: _attendance, loading: loadingAttendance, isError: isErrorAttendance } = useUserAttendance(eventId);
    const { stats: _stats, loading: loadingStats, isError: isErrorStats } = useGetAttendanceStats(eventId);
    const { attendees, loading: loadingAttendees, isError: isErrorAttendees } = useGetAllAttendees(eventId);

    if (loadingAttendance || loadingStats || loadingAttendees) return <Skeleton className="h-[445px] w-full" />;

    if (isErrorAttendance || isErrorStats || isErrorAttendees) {
        return (
            <Empty className="h-[450px] w-full border border-dashed">
                <EmptyHeader>
                    <EmptyTitle>{t("no-data")}</EmptyTitle>
                    <EmptyDescription>{t("attendance-data-not-found")}</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    const chartConfig = {
        count: { label: t("total"), color: "var(--chart-5)" }
    } satisfies ChartConfig;

    const chartData = StructureAttendeesRegisteredChart(attendees || []);

    return (
        <Card className="rounded-md py-0 shadow-none">
            <CardHeader className="flex flex-col items-stretch gap-1 border-b p-6 pb-4!">
                <CardTitle>{t("analytics-attendance")}</CardTitle>
                <CardDescription>{t("analytics-attendance-description")}</CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-4">
                <ChartContainer config={chartConfig} className={cn("h-[300px] w-full", className)}>
                    <BarChart accessibilityLayer data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={(value) => format(value, "MMM dd")} />
                        <ChartTooltip content={<ChartTooltipContent labelFormatter={(value) => format(value, "P")} />} />
                        <Bar dataKey="count" fill="var(--color-count)" maxBarSize={120} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default AttendeesRegisteredChart;
