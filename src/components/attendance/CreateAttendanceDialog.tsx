import { useState } from "react";
import { useTranslation } from "react-i18next";

import CreateAttendanceFormFieldsAttendees from "@/components/attendance/CreateAttendanceFormFieldsAttendees";
import CreateAttendanceFormFieldsExclusives from "@/components/attendance/CreateAttendanceFormFieldsExclusives";
import CreateAttendanceMainForm from "@/components/attendance/CreateAttendanceMainForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useCreateAttendance } from "@/hooks/attendance/useCreateAttendance";
import { prepareCreateAttendanceData } from "@/services/attendance/Attendance.helpers";
import { AttendanceDataUnion, CreateAttendanceInitData } from "@/services/attendance/Attendance.schemas";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const stepMapping: Record<1 | 2 | 3, "MAIN" | "FORM_FIELDS_ATTENDEES" | "FORM_FIELDS_EXCLUSIVES"> = {
    1: "MAIN",
    2: "FORM_FIELDS_ATTENDEES",
    3: "FORM_FIELDS_EXCLUSIVES"
};

function CreateAttendanceDialog() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const { selectedEvent } = useSelectedEvent();
    const [attendanceData, setAttendanceData] = useState(CreateAttendanceInitData);
    const { createAttendance } = useCreateAttendance(() => setOpen(false));

    function appendData(data: AttendanceDataUnion) {
        const key = stepMapping[step];
        const finalized = { ...attendanceData, [key]: data };
        setAttendanceData(finalized);

        if (step === 3) {
            const prepareData = prepareCreateAttendanceData(finalized);
            createAttendance({ eventId: selectedEvent, payload: prepareData });
        } else {
            setStep(step === 1 ? 2 : 3);
        }
    }

    function goBack() {
        setStep((prevStep) => (prevStep === 3 ? 2 : 1));
    }

    function resetState() {
        setAttendanceData(CreateAttendanceInitData);
        setStep(1);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>{t("create-attendance")}</Button>
            </DialogTrigger>
            <DialogContent onCloseAutoFocus={resetState} className="inset-0 h-screen w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-none p-0 sm:max-w-none rtl:translate-x-0">
                <VisuallyHidden>
                    <DialogTitle>{t("create-attendance-dialog")}</DialogTitle>
                    <DialogDescription>{t("create-attendance-dialog")}</DialogDescription>
                </VisuallyHidden>
                <CreateAttendanceMainForm className={step === 1 ? "" : "hidden"} appendData={appendData} />
                <CreateAttendanceFormFieldsAttendees className={step === 2 ? "" : "hidden"} appendData={appendData} goBack={goBack} />
                <CreateAttendanceFormFieldsExclusives className={step === 3 ? "" : "hidden"} appendData={appendData} goBack={goBack} />
            </DialogContent>
        </Dialog>
    );
}

export default CreateAttendanceDialog;
