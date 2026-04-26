import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { deleteWorkshop as deleteWorkshopAPI } from '@/services/workshop/Workshop.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteWorkshop() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: deleteWorkshop,
        isPending: loading,
        isError,
        isSuccess,
        reset
    } = useMutation({
        mutationFn: ({ eventId, workshopId }: { eventId: string; workshopId: string }) => deleteWorkshopAPI(eventId, workshopId),
        onSuccess: (response) => {
            toast.success(t(response || "workshop-deleted-successfully"));
            queryClient.invalidateQueries({ queryKey: ["event"] });
            queryClient.invalidateQueries({ queryKey: ["workshops"] });
            queryClient.invalidateQueries({ queryKey: ["workshops-stats"] });
            queryClient.invalidateQueries({ queryKey: ["workshop"] });
            queryClient.invalidateQueries({ queryKey: ["workshop-enrollees"] });
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { deleteWorkshop, loading, isError, isSuccess };
}
