import { Layers } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

function NoScopeSelected() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-1 items-center justify-center p-6">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Layers />
                    </EmptyMedia>
                    <EmptyTitle>{t("no-scope-selected")}</EmptyTitle>
                    <EmptyDescription>{t("no-scope-selected-description")}</EmptyDescription>
                </EmptyHeader>
            </Empty>
        </div>
    );
}

export default NoScopeSelected;
