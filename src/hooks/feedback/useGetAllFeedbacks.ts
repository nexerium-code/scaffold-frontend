import { getAllFeedbacks as getAllFeedbacksAPI } from '@/services/feedback/Feedback.api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetAllFeedbacks(eventId: string) {
    const {
        data: feedbacks,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["feedbacks", eventId],
        queryFn: () => getAllFeedbacksAPI(eventId),
        placeholderData: keepPreviousData,
        retry: false
    });

    return { feedbacks, loading, isError };
}
