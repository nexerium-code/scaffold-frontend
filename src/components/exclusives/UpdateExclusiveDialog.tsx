import UpdateExclusiveForm from '@/components/exclusives/UpdateExclusiveForm';
import PlaceholderSkeleton from '@/components/skeleton/PlaceholderSkeleton';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSelectedEvent } from '@/contexts/event-provider';
import { useUserAttendance } from '@/hooks/attendance/useUserAttendance';
import { useExclusiveById } from '@/hooks/exclusives/useExclusiveById';

function UpdateExclusiveDialog({ exclusiveId, onClose }: { exclusiveId: string; onClose: (open: boolean) => void }) {
    const { t } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const { attendance } = useUserAttendance(selectedEvent);
    const { exclusive, loading, isError } = useExclusiveById(selectedEvent, exclusiveId);

    return (
        <Dialog defaultOpen onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("update-exclusive")}</DialogTitle>
                    <DialogDescription>{t("update-exclusive-description")}</DialogDescription>
                </DialogHeader>
                {loading && <PlaceholderSkeleton />}
                {!loading && isError && <div className="text-destructive text-center">{t("error-fetching-data")}</div>}
                {!loading && !isError && <UpdateExclusiveForm eventId={selectedEvent} formFields={attendance?.formFieldsExclusives || {}} exclusiveId={exclusiveId} exclusivePicture={exclusive?.picture || ""} exclusiveData={exclusive?.data || {}} successCB={onClose} />}
            </DialogContent>
        </Dialog>
    );
}

export default UpdateExclusiveDialog;
