import { useTranslation } from "react-i18next";

import ExclusiveViewTable from "@/components/exclusives/ExclusiveViewTable";
import PlaceholderSkeleton from "@/components/skeleton/PlaceholderSkeleton";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useUserAttendance } from "@/hooks/attendance/useUserAttendance";
import { useExclusiveById } from "@/hooks/exclusives/useExclusiveById";

function ViewExclusiveSheet({ exclusiveId, onClose }: { exclusiveId: string; onClose: (open: boolean) => void }) {
    const { t, i18n } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const { attendance } = useUserAttendance(selectedEvent);
    const { exclusive, loading, isError } = useExclusiveById(selectedEvent, exclusiveId);

    return (
        <Sheet defaultOpen onOpenChange={onClose}>
            <SheetContent side={i18n.language === "en-US" ? "right" : "left"} className="w-full overflow-y-auto sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle>{t("exclusive-info")}</SheetTitle>
                    <SheetDescription>{t("view-exclusive-info")}</SheetDescription>
                </SheetHeader>
                {loading && <PlaceholderSkeleton />}
                {!loading && isError && <div className="text-destructive text-center">{t("error-fetching-data")}</div>}
                {!loading && !isError && exclusive && <ExclusiveViewTable formFields={attendance?.formFieldsExclusives || {}} exclusive={exclusive} />}
            </SheetContent>
        </Sheet>
    );
}

export default ViewExclusiveSheet;
