import { getFeedbackStats as getFeedbacksStatsAPI } from "@/services/feedback/Feedback.api";
import { useQuery } from "@tanstack/react-query";

export function useGetFeedbacksStats(eventId: string) {
    const {
        data: stats,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["feedbacks-stats", eventId],
        queryFn: () => getFeedbacksStatsAPI(eventId),
        retry: false
    });

    return { stats, loading, isError };
}
