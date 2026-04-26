import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { deleteStaff as deleteStaffAPI } from "@/services/staff/Staff.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteStaff(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: deleteStaff,
        isPending: loading,
        isError,
        isSuccess,
        reset
    } = useMutation({
        mutationFn: ({ eventId, participantId, staffIds }: { eventId: string; participantId: string; staffIds: string[] }) => deleteStaffAPI(eventId, participantId, staffIds),
        onSuccess: (response) => {
            toast.success(t(response || "staff-deleted-successfully"));
            queryClient.invalidateQueries({ queryKey: ["participants-stats"] });
            queryClient.invalidateQueries({ queryKey: ["participant-staff"] });
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { deleteStaff, loading, isError, isSuccess };
}
