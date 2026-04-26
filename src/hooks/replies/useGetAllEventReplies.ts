import { useGetAllFeedbacks } from "@/hooks/feedback/useGetAllFeedbacks";
import { getAllReplies } from "@/services/replies/Replies.api";
import { useQueries } from "@tanstack/react-query";

export function useGetAllEventReplies(eventId: string) {
    const { feedbacks, loading: loadingFeedbacks, isError: isErrorFeedbacks } = useGetAllFeedbacks(eventId);

    const replyQueries = useQueries({
        queries: (feedbacks ?? []).map((feedback) => ({
            queryKey: ["feedback-replies", eventId, feedback._id],
            queryFn: () => getAllReplies(eventId, feedback._id),
            retry: false
        }))
    });

    const loading = loadingFeedbacks || replyQueries.some((q) => q.isPending);
    const isError = isErrorFeedbacks || replyQueries.some((q) => q.isError);
    const replies = replyQueries.flatMap((q) => q.data ?? []);

    return { replies, loading, isError };
}
