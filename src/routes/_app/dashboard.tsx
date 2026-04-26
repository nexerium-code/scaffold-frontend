import { ArrowLeftRight, CalendarIcon, Laptop, LinkIcon, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import AttendeesAttendedChart from "@/components/analytics/AttendeesAttendedChart";
import AttendeesRegisteredChart from "@/components/analytics/AttendeesRegisteredChart";
import EnrolleesApprovedChart from "@/components/analytics/EnrolleesApprovedChart";
import ExclusivesAttendedChart from "@/components/analytics/ExclusivesAttendedChart";
import ParticipantsApprovedChart from "@/components/analytics/ParticipantsApprovedChart";
import RepliesRecievedChart from "@/components/analytics/RepliesRecievedChart";
import GenericError from "@/components/empty-states/GenericError";
import NoEventSelected from "@/components/empty-states/NoEventSelected";
import UpdateEventDialog from "@/components/events/UpdateEventDialog";
import CopyInput from "@/components/general/CopyInput";
import DashboardSkeleton from "@/components/skeleton/DashboardSkeleton";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useUserEvent } from "@/hooks/events/useUserEvent";
import { LocationTypes } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
    component: Dashboard
});
function Dashboard() {
    const { t } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const { event, loading, isError } = useUserEvent(selectedEvent);

    if (!selectedEvent) return <NoEventSelected />;
    if (loading) return <DashboardSkeleton />;
    if (isError) return <GenericError />;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">{event?.name}</h1>
                <div className="flex flex-wrap items-center gap-4">
                    <CopyInput icon={event?.location.type === LocationTypes.ONSITE ? MapPin : event?.location.type === LocationTypes.VIRTUAL ? Laptop : event?.location.type === LocationTypes.HYBRID ? ArrowLeftRight : LinkIcon} value={event?.location.url || ""} className="w-2xs" />
                    <ButtonGroup className="shrink-0">
                        <Button>{event?.type}</Button>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">
                                    <CalendarIcon /> {t("dates")}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-max p-0" align="end">
                                <Calendar mode="range" selected={{ from: event?.startDate || new Date(), to: event?.endDate || new Date() }} defaultMonth={event?.startDate || new Date()} onSelect={() => {}} />
                            </PopoverContent>
                        </Popover>
                        <Button className={cn("text-white", event?.publish ? "bg-green-700" : "bg-red-700")}>{event?.publish ? t("public") : t("private")}</Button>
                        <UpdateEventDialog />
                    </ButtonGroup>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <AttendeesRegisteredChart key={`${event?._id}-attendees-registered-chart`} eventId={event?._id || ""} />
                <RepliesRecievedChart key={`${event?._id}-replies-recieved-chart`} eventId={event?._id || ""} />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
                <AttendeesAttendedChart key={`${event?._id}-attendees-attended-chart`} eventId={event?._id || ""} />
                <ExclusivesAttendedChart key={`${event?._id}-exclusives-attended-chart`} eventId={event?._id || ""} />
                <ParticipantsApprovedChart key={`${event?._id}-participants-approved-chart`} eventId={event?._id || ""} />
                <EnrolleesApprovedChart key={`${event?._id}-enrollees-approved-chart`} eventId={event?._id || ""} />
            </div>
        </div>
    );
}
