import { HashIcon, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

import GenericError from "@/components/empty-states/GenericError";
import NoEventSelected from "@/components/empty-states/NoEventSelected";
import CopyInput from "@/components/general/CopyInput";
import StaffSkeleton from "@/components/skeleton/StaffSkeleton";
import StaffTable from "@/components/staff/StaffTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useParticipantById } from "@/hooks/participant/useParticipantById";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/participants/$participantId")({
    component: RouteComponent
});

function RouteComponent() {
    const { t } = useTranslation();
    const { participantId } = Route.useParams();
    const { selectedEvent } = useSelectedEvent();
    const { participant, loading: loadingParticipant, isError } = useParticipantById(selectedEvent, participantId);

    if (!selectedEvent) return <NoEventSelected />;
    if (loadingParticipant) return <StaffSkeleton />;
    if (isError) return <GenericError />;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between xl:gap-0">
                <div className="flex w-full items-end gap-4 xl:w-max">
                    <Avatar className="size-10 rounded-lg">
                        <AvatarImage src={participant?.logo} alt="profilePic" />
                        <AvatarFallback className="rounded-lg">PP</AvatarFallback>
                    </Avatar>
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                        {participant?.name}
                        <span className="text-xl font-light italic">{t("staff-suffix")}</span>
                    </h1>
                </div>
                <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:justify-between xl:w-max">
                    <CopyInput icon={HashIcon} value={`${participant?.reference}`} />
                    <CopyInput icon={Mail} value={`${participant?.email}`} />
                </div>
            </div>
            <Separator />
            <StaffTable key={selectedEvent + participant?._id || ""} eventId={selectedEvent} participantId={participant?._id || ""} />
        </div>
    );
}
