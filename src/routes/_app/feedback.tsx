import { Mails, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

import GenericError from "@/components/empty-states/GenericError";
import NoEventSelected from "@/components/empty-states/NoEventSelected";
import CreateFeedbackDialog from "@/components/feedback/CreateFeedbackDialog";
import FeedbackTable from "@/components/feedback/FeedbackTable";
import FeedbackSkeleton from "@/components/skeleton/FeedbackSkeleton";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useUserEvent } from "@/hooks/events/useUserEvent";
import { useGetAllFeedbacks } from "@/hooks/feedback/useGetAllFeedbacks";
import { useGetFeedbacksStats } from "@/hooks/feedback/useGetFeedbacksStats";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/feedback")({
    component: RouteComponent
});

function RouteComponent() {
    const { t } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const { event, loading: loadingUserEvent, isError: isErrorUserEvent } = useUserEvent(selectedEvent);
    const { feedbacks: _, loading: loadingFeedbacks, isError: isErrorFeedbacks } = useGetAllFeedbacks(selectedEvent);
    const { stats, loading: loadingStats, isError: isErrorStats } = useGetFeedbacksStats(selectedEvent);

    if (!selectedEvent) return <NoEventSelected />;
    if (loadingUserEvent || loadingFeedbacks || loadingStats) return <FeedbackSkeleton />;
    if (isErrorUserEvent || isErrorFeedbacks || isErrorStats) return <GenericError />;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                    {event?.name}
                    <span className="text-xl font-light italic">{t("feedback-suffix")}</span>
                </h1>
                <CreateFeedbackDialog />
            </div>
            <div className="grid grid-cols-1 divide-y rounded-md border md:grid-cols-2 md:divide-x md:divide-y-0">
                <div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats?.feedbackCount || 0}</h3>
                        <Send className="text-muted-foreground size-5" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-muted-foreground text-sm font-medium">{t("total-feedbacks")}</p>
                        <span className="text-muted-foreground text-sm italic underline">{t("created")}</span>
                    </div>
                </div>
                <div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats?.replyCount || 0}</h3>
                        <Mails className="text-muted-foreground size-5" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-muted-foreground text-sm font-medium">{t("total-replies")}</p>
                        <span className="text-muted-foreground text-sm italic underline">{t("received")}</span>
                    </div>
                </div>
            </div>
            <FeedbackTable key={`${event?._id}-feedback-table`} eventId={event?._id || ""} />
        </div>
    );
}
