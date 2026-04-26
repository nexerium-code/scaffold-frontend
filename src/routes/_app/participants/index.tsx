import { Briefcase, Code, CodeXml, Inbox, Mail, UserCheck, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import NoEventSelected from "@/components/empty-states/NoEventSelected";
import NoProvisionFound from "@/components/empty-states/NoProvisionFound";
import CopyInput from "@/components/general/CopyInput";
import ParticipantsTable from "@/components/participant/ParticipantsTable";
import UpdateProvisionDialog from "@/components/provision/UpdateProvisionDialog";
import ParticipantsSkeleton from "@/components/skeleton/ParticipantsSkeleton";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useUserEvent } from "@/hooks/events/useUserEvent";
import { useGetParticipantsStats } from "@/hooks/participant/useGetParticipantsStats";
import { useUserProvision } from "@/hooks/provision/useUserProvision";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/participants/")({
    component: RouteComponent
});

function RouteComponent() {
    const { t } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const { event, loading: loadingUserEvent } = useUserEvent(selectedEvent);
    const { provision, loading: loadingProvision, isError } = useUserProvision(selectedEvent);
    const { stats, loading: loadingStats } = useGetParticipantsStats(selectedEvent);

    if (!selectedEvent) return <NoEventSelected />;
    if (loadingUserEvent || loadingProvision || loadingStats) return <ParticipantsSkeleton />;
    if (isError) return <NoProvisionFound />;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                    {event?.name}
                    <span className="text-xl font-light italic">{t("participants-suffix")}</span>
                </h1>
                <ButtonGroup>
                    <Button className={cn("text-white", provision?.publish ? "bg-green-700" : "bg-red-700")}>{provision?.publish ? t("public") : t("private")}</Button>
                    <UpdateProvisionDialog />
                </ButtonGroup>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="grid w-full gap-2">
                    <Label>{t("reference-endpoint")}</Label>
                    <CopyInput value={`${import.meta.env.VITE_BE_ENDPOINT}/provision/public/${event?._id}`} icon={Code} />
                </div>
                <div className="grid w-full gap-2">
                    <Label>{t("registration-endpoint")}</Label>
                    <CopyInput value={`${import.meta.env.VITE_BE_ENDPOINT}/participant/${event?._id}/public`} icon={CodeXml} />
                </div>
                <div className="grid w-full gap-2">
                    <Label>{t("sender-email")}</Label>
                    <CopyInput value={`${provision?.senderEmail}`} icon={Mail} />
                </div>
                <div className="grid w-full gap-2">
                    <Label>{t("manager-email")}</Label>
                    <CopyInput value={`${provision?.managerEmail}`} icon={Inbox} />
                </div>
            </div>
            <div className="grid grid-cols-1 divide-y rounded-md border md:grid-cols-3 md:divide-x md:divide-y-0">
                <div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats?.participantCount || 0}</h3>
                        <Users className="text-muted-foreground size-5" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-muted-foreground text-sm font-medium">{t("total-participants")}</p>
                        <span className="text-muted-foreground text-sm italic underline">{t("created")}</span>
                    </div>
                </div>
                <div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats?.approvedParticipantCount || 0}</h3>
                        <UserCheck className="text-muted-foreground size-5" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-muted-foreground text-sm font-medium">{t("total-approved")}</p>
                        <span className="text-muted-foreground text-sm italic underline">{t("checked")}</span>
                    </div>
                </div>
                <div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats?.staffCount || 0}</h3>
                        <Briefcase className="text-muted-foreground size-5" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-muted-foreground text-sm font-medium">{t("total-staff")}</p>
                        <span className="text-muted-foreground text-sm italic underline">{t("added")}</span>
                    </div>
                </div>
            </div>
            <ParticipantsTable key={`${event?._id}-participants-table`} eventId={event?._id || ""} />
        </div>
    );
}
