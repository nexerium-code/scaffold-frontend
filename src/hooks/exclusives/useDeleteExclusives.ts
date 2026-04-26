import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { deleteExclusives as deleteExclusivesAPI } from '@/services/exclusives/Exclusives.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteExclusives(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: deleteExclusives,
        isPending: loading,
        isSuccess,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, exclusiveIds }: { eventId: string; exclusiveIds: string[] }) => deleteExclusivesAPI(eventId, exclusiveIds),
        onSuccess: (response) => {
            toast.success(t(response || "exclusives-deleted-successfully"));
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
            queryClient.invalidateQueries({ queryKey: ["attendance-stats"] });
            queryClient.invalidateQueries({ queryKey: ["exclusives"] });
            queryClient.invalidateQueries({ queryKey: ["exclusive"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { deleteExclusives, loading, isError, isSuccess };
}
