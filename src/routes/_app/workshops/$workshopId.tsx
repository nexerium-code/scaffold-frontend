import { CodeXml, GraduationCap, Inbox, Mail, Mails, Pencil } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import GenericError from "@/components/empty-states/GenericError";
import NoEventSelected from "@/components/empty-states/NoEventSelected";
import EnrolleesTable from "@/components/enrollees/EnrolleesTable";
import CopyInput from "@/components/general/CopyInput";
import EnrolleesSkeleton from "@/components/skeleton/EnrolleesSkeleton";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import UpdateWorkshopDialog from "@/components/workshop/UpdateWorkshopDialog";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useGetAllEnrollees } from "@/hooks/enrollees/useGetAllEnrollees";
import { useWorkshopById } from "@/hooks/workshop/useWorkshopById";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/workshops/$workshopId")({
    component: RouteComponent
});

function RouteComponent() {
    const { t, i18n } = useTranslation();
    const { workshopId } = Route.useParams();
    const { selectedEvent } = useSelectedEvent();
    const { workshop, loading: loadingWorkshop, isError: isErrorWorkshop } = useWorkshopById(selectedEvent, workshopId);
    const { enrollees, loading: loadingEnrollees, isError: isErrorEnrollees } = useGetAllEnrollees(selectedEvent, workshopId);

    const [updateDialogState, setUpdateDialogState] = useState(false);

    if (!selectedEvent) return <NoEventSelected />;
    if (loadingWorkshop || loadingEnrollees) return <EnrolleesSkeleton />;
    if (isErrorWorkshop || isErrorEnrollees) return <GenericError />;

    const totalEnrollees = enrollees?.length || 0;
    const totalApprovedEnrollees = enrollees?.filter((enrollee) => enrollee.approved).length || 0;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="max-w-lg truncate text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                    {i18n.language === "en-US" ? workshop?.titleEN : workshop?.titleAR}
                    <span className="text-xl font-light italic">{t("enrollees-suffix")}</span>
                </h1>
                <ButtonGroup className="shrink-0">
                    <Button className={cn("text-white", workshop?.publish ? "bg-green-700" : "bg-red-700")}>{workshop?.publish ? t("public") : t("private")}</Button>
                    <Button variant="secondary" onClick={() => setUpdateDialogState(true)}>
                        <Pencil /> {t("edit")}
                    </Button>
                </ButtonGroup>
            </div>
            {updateDialogState && <UpdateWorkshopDialog eventId={selectedEvent} workshopId={workshopId} onClose={setUpdateDialogState} />}
            <Separator />
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="grid w-full gap-2">
                    <Label>{t("registration-endpoint")}</Label>
                    <CopyInput value={`${import.meta.env.VITE_BE_ENDPOINT}/enrollees/${selectedEvent}/${workshopId}/public`} icon={CodeXml} />
                </div>
                <div className="grid w-full gap-2">
                    <Label>{t("sender-email")}</Label>
                    <CopyInput value={`${workshop?.senderEmail}`} icon={Mail} />
                </div>
                <div className="grid w-full gap-2">
                    <Label>{t("manager-email")}</Label>
                    <CopyInput value={`${workshop?.managerEmail}`} icon={Inbox} />
                </div>
            </div>
            <div className="grid grid-cols-1 divide-y rounded-md border md:grid-cols-2 md:divide-x md:divide-y-0">
                <div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{totalEnrollees}</h3>
                        <Mails className="text-muted-foreground size-5" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-muted-foreground text-sm font-medium">{t("total-enrollees")}</p>
                        <span className="text-muted-foreground text-sm italic underline">{t("registered")}</span>
                    </div>
                </div>
                <div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{totalApprovedEnrollees}</h3>
                        <GraduationCap className="text-muted-foreground size-5" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-muted-foreground text-sm font-medium">{t("total-approved")}</p>
                        <span className="text-muted-foreground text-sm italic underline">{t("checked")}</span>
                    </div>
                </div>
            </div>
            <EnrolleesTable key={selectedEvent + workshopId} eventId={selectedEvent} workshopId={workshopId} />
        </div>
    );
}
