import { useTranslation } from "react-i18next";

import UpdateAttendeeForm from "@/components/attendees/UpdateAttendeeForm";
import PlaceholderSkeleton from "@/components/skeleton/PlaceholderSkeleton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useUserAttendance } from "@/hooks/attendance/useUserAttendance";
import { useAttendeeById } from "@/hooks/attendees/useAttendeeById";

function UpdateAttendeeSheet({ attendeeId, onClose }: { attendeeId: string; onClose: (open: boolean) => void }) {
    const { t, i18n } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const { attendance } = useUserAttendance(selectedEvent);
    const { attendee, loading, isError } = useAttendeeById(selectedEvent, attendeeId);

    return (
        <Sheet defaultOpen onOpenChange={onClose}>
            <SheetContent side={i18n.language === "en-US" ? "right" : "left"} className="w-full overflow-y-auto sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>{t("attendee-info")}</SheetTitle>
                    <SheetDescription>{t("update-attendee-info")}</SheetDescription>
                </SheetHeader>
                {loading && <PlaceholderSkeleton />}
                {!loading && isError && <div className="text-destructive text-center">{t("error-fetching-data")}</div>}
                {!loading && !isError && <UpdateAttendeeForm eventId={selectedEvent} formFields={attendance?.formFieldsAttendees || {}} attendeeId={attendeeId} attendeeData={attendee?.data || {}} successCB={onClose} />}
            </SheetContent>
        </Sheet>
    );
}

export default UpdateAttendeeSheet;
