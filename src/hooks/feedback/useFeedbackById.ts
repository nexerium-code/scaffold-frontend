import { getFeedbackById as getFeedbackByIdAPI } from '@/services/feedback/Feedback.api';
import { useQuery } from '@tanstack/react-query';

export function useFeedbackById(eventId: string, feedbackId: string) {
    const {
        data: feedback,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["feedback", eventId, feedbackId],
        queryFn: () => getFeedbackByIdAPI(eventId, feedbackId),
        retry: false
    });

    return { feedback, loading, isError };
}
