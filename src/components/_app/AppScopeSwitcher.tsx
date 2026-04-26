import { CheckCheck, ChevronDown, Layers, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import CreateScopeDialog from "@/components/scopes/CreateScopeDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelectedScope } from "@/contexts/scope-provider";
import { useUserScopes } from "@/hooks/scopes/useUserScopes";
import { cn } from "@/lib/utils";

type AppScopeSwitcherProps = {
    showCreateScopeButton: boolean;
};

function AppScopeSwitcher({ showCreateScopeButton }: AppScopeSwitcherProps) {
    const { t } = useTranslation();
    const { state } = useSidebar();
    const { scopes, loading } = useUserScopes();
    const { selectedScope, setSelectedScope } = useSelectedScope();
    const [createScopeState, setCreateScopeState] = useState(false);

    const hasScopes = scopes && scopes.length > 0;
    const chosenScope = useMemo(() => {
        if (!selectedScope || !scopes) return null;
        return scopes.find((scope) => scope._id === selectedScope);
    }, [scopes, selectedScope]);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size={state === "collapsed" ? "lg" : "default"} className="w-fit" tooltip={t("scopes")}>
                            <div className={cn("bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-sm", state === "collapsed" ? "size-8" : "size-6")}>
                                <Layers />
                            </div>
                            <span className="max-w-30 truncate font-semibold">{chosenScope ? chosenScope.name : t("select-scope-dots")}</span>
                            <ChevronDown />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    {loading && (
                        <DropdownMenuContent className="flex w-60 flex-col gap-2 p-2" align="start" side="bottom" sideOffset={state === "collapsed" ? 8 : 4}>
                            {[1, 2, 3].map((item) => (
                                <Skeleton key={item} className="h-8 w-full" />
                            ))}
                        </DropdownMenuContent>
                    )}

                    {!loading && !hasScopes && (
                        <DropdownMenuContent className="w-60" align="start" side="bottom" sideOffset={state === "collapsed" ? 8 : 4}>
                            <DropdownMenuLabel className="text-muted-foreground text-xs">{t("no-scope-found")}</DropdownMenuLabel>
                            {showCreateScopeButton && (
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onSelect={() => setCreateScopeState(true)}>
                                        <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                                            <Plus />
                                        </div>
                                        {t("create-scope")}
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            )}
                        </DropdownMenuContent>
                    )}

                    {!loading && hasScopes && (
                        <DropdownMenuContent className="w-60" align="start" side="bottom" sideOffset={state === "collapsed" ? 8 : 4}>
                            <DropdownMenuLabel className="text-muted-foreground text-xs">{t("scopes")}</DropdownMenuLabel>
                            <DropdownMenuGroup>
                                {scopes.map((scope) => (
                                    <DropdownMenuItem key={scope._id} onClick={() => setSelectedScope(scope._id)} className="gap-2 p-2">
                                        <Layers />
                                        <span className="max-w-4/5 truncate">{scope.name}</span>
                                        {selectedScope === scope._id && <CheckCheck className="ms-auto" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuGroup>
                            {showCreateScopeButton && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onSelect={() => setCreateScopeState(true)}>
                                            <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                                                <Plus />
                                            </div>
                                            {t("create-scope")}
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </>
                            )}
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>
                <CreateScopeDialog open={createScopeState} onOpenChange={setCreateScopeState} showTrigger={false} />
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export default AppScopeSwitcher;
