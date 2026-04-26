import { BookOpen, ClipboardCheck, Globe, PieChart, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

import AppEventsSwitcher from "@/components/_app/AppEventsSwitcher";
import AppSystemPrefrences from "@/components/_app/AppSystemPrefrences";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useSelectedEvent } from "@/contexts/event-provider";
import { MetaData, RoleTypes } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "@tanstack/react-router";

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useUser();
    const { t, i18n } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const pathname = useLocation({ select: (location) => location.pathname });
    const { state } = useSidebar();

    // Grab the user role and permissions from the user's public metadata
    const userRole = (user?.publicMetadata as MetaData)?.role;
    const userSelectedEventPermissions = (user?.publicMetadata as MetaData)?.permissions?.[selectedEvent];

    // Derive the visibility of the navigation items
    const showAttendanceNavigation = userRole === RoleTypes.ADMIN || userSelectedEventPermissions?.attendance;
    const showParticipantsNavigation = userRole === RoleTypes.ADMIN || userSelectedEventPermissions?.participants;
    const showWorkshopsNavigation = userRole === RoleTypes.ADMIN || userSelectedEventPermissions?.workshops;
    const showFeedbacksNavigation = userRole === RoleTypes.ADMIN || userSelectedEventPermissions?.feedbacks;
    const showCreateEventButton = userRole === RoleTypes.ADMIN;

    return (
        <Sidebar collapsible="icon" side={i18n.language === "en-US" ? "left" : "right"} {...props}>
            <SidebarHeader className={cn("border-b", state === "expanded" && "h-12 flex-row items-center justify-between")}>
                <AppEventsSwitcher showCreateEventButton={showCreateEventButton} />
                <SidebarTrigger className="hidden md:inline-flex" />
            </SidebarHeader>
            <SidebarContent>
                {selectedEvent !== "" && (
                    <SidebarGroup>
                        <SidebarGroupLabel>{t("platform")}</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton isActive={pathname === "/dashboard"} tooltip={t("dashboard")} asChild>
                                    <Link to="/dashboard">
                                        <PieChart />
                                        <span>{t("dashboard")}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {showAttendanceNavigation && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton isActive={pathname.startsWith("/attendance")} tooltip={t("attendance")} asChild>
                                        <Link to="/attendance">
                                            <ClipboardCheck />
                                            <span>{t("attendance")}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                            {showParticipantsNavigation && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton isActive={pathname.startsWith("/participants")} tooltip={t("participants")} asChild>
                                        <Link to="/participants">
                                            <Globe />
                                            <span>{t("participants")}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                            {showWorkshopsNavigation && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton isActive={pathname.startsWith("/workshop")} tooltip={t("workshops")} asChild>
                                        <Link to="/workshops">
                                            <BookOpen />
                                            <span>{t("workshops")}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                            {showFeedbacksNavigation && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton isActive={pathname.startsWith("/feedback")} tooltip={t("feedbacks")} asChild>
                                        <Link to="/feedback">
                                            <Send />
                                            <span>{t("feedbacks")}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>
            {state === "expanded" && (
                <SidebarFooter>
                    <SidebarGroup>
                        <SidebarGroupLabel>{t("preferences")}</SidebarGroupLabel>
                        <AppSystemPrefrences />
                    </SidebarGroup>
                </SidebarFooter>
            )}
            <SidebarRail />
        </Sidebar>
    );
}

export default AppSidebar;
