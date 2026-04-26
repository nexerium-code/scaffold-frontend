import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { updateWorkshop as updateWorkshopAPI } from '@/services/workshop/Workshop.api';
import { WorkshopSchemaType } from '@/services/workshop/Workshop.schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateWorkshop(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateWorkshop,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, workshopId, payload }: { eventId: string; workshopId: string; payload: WorkshopSchemaType }) => updateWorkshopAPI(eventId, workshopId, payload),
        onSuccess: (response) => {
            toast.success(t(response || "workshop-updated-successfully"));
            queryClient.invalidateQueries({ queryKey: ["event"] });
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

    return { updateWorkshop, loading, success, isError, reset };
}
