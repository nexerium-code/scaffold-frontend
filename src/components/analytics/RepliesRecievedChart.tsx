import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetFeedbacksStats } from "@/hooks/feedback/useGetFeedbacksStats";
import { useGetAllEventReplies } from "@/hooks/replies/useGetAllEventReplies";
import { cn } from "@/lib/utils";
import { StructureRepliesReceivedChart } from "@/services/replies/Replies.helpers";

type RepliesRecievedChartProps = {
    eventId: string;
    className?: string;
};

function RepliesRecievedChart({ eventId, className }: RepliesRecievedChartProps) {
    const { t } = useTranslation();
    const { stats, loading: loadingStats, isError: isErrorStats } = useGetFeedbacksStats(eventId);
    const { replies, loading: loadingReplies, isError: isErrorReplies } = useGetAllEventReplies(eventId);

    if (loadingStats || loadingReplies) return <Skeleton className="h-[445px] w-full" />;

    if (isErrorStats || isErrorReplies || stats?.feedbackCount === 0) {
        return (
            <Empty className="max-h-[450px] w-full border border-dashed">
                <EmptyHeader>
                    <EmptyTitle>{t("no-data")}</EmptyTitle>
                    <EmptyDescription>{t("feedback-data-not-found")}</EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }

    const chartConfig = {
        count: { label: t("total"), color: "var(--chart-5)" }
    } satisfies ChartConfig;

    const chartData = StructureRepliesReceivedChart(replies || []);

    return (
        <Card className="rounded-md py-0 shadow-none">
            <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 p-6 pb-4">
                    <CardTitle>{t("analytics-feedback")}</CardTitle>
                    <CardDescription>{t("analytics-feedback-description")}</CardDescription>
                </div>
                <div className="flex">
                    <div className="flex flex-1 flex-col justify-center gap-0.5 border-t p-5 even:border-s sm:border-s sm:border-t-0">
                        <span className="text-muted-foreground text-xs">{t("feedbacks")}</span>
                        <span className="text-lg leading-none font-bold sm:text-3xl">{stats?.feedbackCount || 0}</span>
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-0.5 border-t p-5 even:border-s sm:border-s sm:border-t-0">
                        <span className="text-muted-foreground text-xs">{t("replies")}</span>
                        <span className="text-lg leading-none font-bold sm:text-3xl">{stats?.replyCount || 0}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-0 py-4">
                <ChartContainer config={chartConfig} className={cn("h-[300px] w-full", className)}>
                    <AreaChart accessibilityLayer data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={(value) => format(value, "MMM dd")} />
                        <ChartTooltip content={<ChartTooltipContent labelFormatter={(value) => format(value, "P")} />} />
                        <Area type="monotone" dataKey="count" stroke="var(--color-count)" fill="url(#fillCount)" fillOpacity={0.4} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

export default RepliesRecievedChart;
