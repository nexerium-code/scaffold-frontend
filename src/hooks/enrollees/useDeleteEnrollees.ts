import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { deleteEnrollees as deleteEnrolleesAPI } from '@/services/enrollees/Enrollees.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteEnrollees(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: deleteEnrollees,
        isPending: loading,
        isError,
        isSuccess,
        reset
    } = useMutation({
        mutationFn: ({ eventId, workshopId, enrolleeIds }: { eventId: string; workshopId: string; enrolleeIds: string[] }) => deleteEnrolleesAPI(eventId, workshopId, enrolleeIds),
        onSuccess: (response) => {
            toast.success(t(response || "enrollee-deleted-successfully"));
            queryClient.invalidateQueries({ queryKey: ["enrollees"] });
            queryClient.invalidateQueries({ queryKey: ["enrollee"] });
            queryClient.invalidateQueries({ queryKey: ["workshops"] });
            queryClient.invalidateQueries({ queryKey: ["workshops-stats"] });
            queryClient.invalidateQueries({ queryKey: ["workshop"] });
            queryClient.invalidateQueries({ queryKey: ["workshop-enrollees"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { deleteEnrollees, loading, isError, isSuccess };
}
