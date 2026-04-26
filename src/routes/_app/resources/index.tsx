import { useTranslation } from "react-i18next";
import { createFileRoute } from "@tanstack/react-router";

import NoScopeSelected from "@/components/empty-states/NoScopeSelected";
import ResourcesTable from "@/components/resources/ResourcesTable";
import { useSelectedScope } from "@/contexts/scope-provider";

export const Route = createFileRoute("/_app/resources/")({
    component: Resources
});

function Resources() {
    const { t } = useTranslation();
    const { selectedScope } = useSelectedScope();

    if (!selectedScope) return <NoScopeSelected />;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">{t("resources")}</h1>
                    <p className="text-muted-foreground text-sm">{t("resources-description")}</p>
                </div>
            </div>
            <ResourcesTable scopeId={selectedScope} />
        </div>
    );
}
