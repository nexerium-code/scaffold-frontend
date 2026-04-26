import { getAllReplies as getAllRepliesAPI } from '@/services/replies/Replies.api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetAllReplies(eventId: string, feedbackId: string) {
    const {
        data: replies,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["feedback-replies", eventId, feedbackId],
        queryFn: () => getAllRepliesAPI(eventId, feedbackId),
        placeholderData: keepPreviousData,
        retry: false
    });

    return { replies, loading, isError };
}
