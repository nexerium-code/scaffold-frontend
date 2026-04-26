import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { createFileRoute, Link } from "@tanstack/react-router";

import GenericError from "@/components/empty-states/GenericError";
import NoScopeSelected from "@/components/empty-states/NoScopeSelected";
import ResourceSkeleton from "@/components/skeleton/ResourceSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSelectedScope } from "@/contexts/scope-provider";
import { useResourceById } from "@/hooks/resources/useResourceById";

export const Route = createFileRoute("/_app/resources/$resourceId")({
    component: ResourceDetails
});

function ResourceDetails() {
    const { t } = useTranslation();
    const { resourceId } = Route.useParams();
    const { selectedScope } = useSelectedScope();
    const { resource, loading, isError } = useResourceById(selectedScope, resourceId);

    if (!selectedScope) return <NoScopeSelected />;
    if (loading) return <ResourceSkeleton />;
    if (isError || !resource) return <GenericError />;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="sm" className="w-fit" asChild>
                        <Link to="/resources">
                            <ArrowLeft data-icon="inline-start" className="rtl:rotate-180" />
                            {t("resources")}
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">{resource.name}</h1>
                        <p className="text-muted-foreground text-sm">{t("resource-details-description")}</p>
                    </div>
                </div>
                <Badge variant="secondary">{t(resource.status)}</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("summary")}</CardTitle>
                        <CardDescription>{t("resource-summary-description")}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 text-sm">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">{t("owner-email")}</span>
                            <span>{resource.ownerEmail}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">{t("updated-at")}</span>
                            <span>{new Date(resource.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t("description")}</CardTitle>
                        <CardDescription>{t("resource-description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">{resource.description || t("no-description")}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
