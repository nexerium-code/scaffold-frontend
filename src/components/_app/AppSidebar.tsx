import { Database, LayoutDashboard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUser } from "@clerk/clerk-react";
import { Link, useLocation } from "@tanstack/react-router";

import AppScopeSwitcher from "@/components/_app/AppScopeSwitcher";
import AppSystemPreferences from "@/components/_app/AppSystemPreferences";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useSelectedScope } from "@/contexts/scope-provider";
import { MetaData, RoleTypes } from "@/lib/enums";
import { cn } from "@/lib/utils";

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user } = useUser();
    const { t, i18n } = useTranslation();
    const { selectedScope } = useSelectedScope();
    const pathname = useLocation({ select: (location) => location.pathname });
    const { state } = useSidebar();

    const userRole = (user?.publicMetadata as MetaData)?.role;
    const userSelectedScopePermissions = (user?.publicMetadata as MetaData)?.permissions?.[selectedScope];

    const showResourcesNavigation = userRole === RoleTypes.ADMIN || userSelectedScopePermissions?.resources;
    const showCreateScopeButton = userRole === RoleTypes.ADMIN;

    return (
        <Sidebar collapsible="icon" side={i18n.language === "en-US" ? "left" : "right"} {...props}>
            <SidebarHeader className={cn("border-b", state === "expanded" && "h-12 flex-row items-center justify-between")}>
                <AppScopeSwitcher showCreateScopeButton={showCreateScopeButton} />
                <SidebarTrigger className="hidden md:inline-flex" />
            </SidebarHeader>
            <SidebarContent>
                {selectedScope !== "" && (
                    <SidebarGroup>
                        <SidebarGroupLabel>{t("platform")}</SidebarGroupLabel>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton isActive={pathname === "/dashboard"} tooltip={t("dashboard")} asChild>
                                    <Link to="/dashboard">
                                        <LayoutDashboard />
                                        <span>{t("dashboard")}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            {showResourcesNavigation && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton isActive={pathname.startsWith("/resources")} tooltip={t("resources")} asChild>
                                        <Link to="/resources">
                                            <Database />
                                            <span>{t("resources")}</span>
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
                        <AppSystemPreferences />
                    </SidebarGroup>
                </SidebarFooter>
            )}
            <SidebarRail />
        </Sidebar>
    );
}

export default AppSidebar;
