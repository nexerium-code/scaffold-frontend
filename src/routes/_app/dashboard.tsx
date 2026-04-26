import { Archive, Database, FileText } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createFileRoute, Link } from "@tanstack/react-router";

import GenericError from "@/components/empty-states/GenericError";
import NoScopeSelected from "@/components/empty-states/NoScopeSelected";
import DashboardSkeleton from "@/components/skeleton/DashboardSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelectedScope } from "@/contexts/scope-provider";
import { useGetAllResources } from "@/hooks/resources/useGetAllResources";
import { ResourceStatusTypes } from "@/lib/enums";

export const Route = createFileRoute("/_app/dashboard")({
    component: Dashboard
});

function Dashboard() {
    const { t } = useTranslation();
    const { selectedScope } = useSelectedScope();
    const { resources, loading, isError } = useGetAllResources(selectedScope);

    const stats = useMemo(() => {
        const items = resources || [];
        return {
            active: items.filter((item) => item.status === ResourceStatusTypes.ACTIVE).length,
            archived: items.filter((item) => item.status === ResourceStatusTypes.ARCHIVED).length,
            draft: items.filter((item) => item.status === ResourceStatusTypes.DRAFT).length,
            total: items.length
        };
    }, [resources]);

    if (!selectedScope) return <NoScopeSelected />;
    if (loading) return <DashboardSkeleton />;
    if (isError) return <GenericError />;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">{t("dashboard")}</h1>
                    <p className="text-muted-foreground text-sm">{t("dashboard-description")}</p>
                </div>
                <Button asChild>
                    <Link to="/resources">
                        <Database data-icon="inline-start" />
                        {t("resources")}
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 divide-y rounded-md border md:grid-cols-4 md:divide-x md:divide-y-0">
                <div className="flex flex-col gap-4 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats.total}</h3>
                        <Database className="text-muted-foreground size-5" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">{t("total-resources")}</p>
                </div>
                <div className="flex flex-col gap-4 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats.active}</h3>
                        <Database className="text-muted-foreground size-5" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">{t("active-resources")}</p>
                </div>
                <div className="flex flex-col gap-4 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats.draft}</h3>
                        <FileText className="text-muted-foreground size-5" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">{t("draft-resources")}</p>
                </div>
                <div className="flex flex-col gap-4 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats.archived}</h3>
                        <Archive className="text-muted-foreground size-5" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">{t("archived-resources")}</p>
                </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("example-module")}</CardTitle>
                        <CardDescription>{t("example-module-description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">{t("example-module-content")}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t("next-steps")}</CardTitle>
                        <CardDescription>{t("next-steps-description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">{t("next-steps-content")}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
