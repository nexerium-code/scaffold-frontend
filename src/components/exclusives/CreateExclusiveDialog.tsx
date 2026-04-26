import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CreateExclusiveForm from '@/components/exclusives/CreateExclusiveForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSelectedEvent } from '@/contexts/event-provider';
import { useUserAttendance } from '@/hooks/attendance/useUserAttendance';

function CreateExclusiveDialog() {
    const { t } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const { attendance } = useUserAttendance(selectedEvent);
    const [open, setOpen] = useState(false);

    return (
        <Tooltip>
            <Dialog open={open} onOpenChange={setOpen}>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                            <PlusCircle />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{t("create-exclusive")}</DialogTitle>
                        <DialogDescription>{t("create-exclusive-description")}</DialogDescription>
                    </DialogHeader>
                    <CreateExclusiveForm eventId={selectedEvent} formFields={attendance?.formFieldsExclusives || {}} onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
            <TooltipContent>{t("create-exclusive")}</TooltipContent>
        </Tooltip>
    );
}

export default CreateExclusiveDialog;
