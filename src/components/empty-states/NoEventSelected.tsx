import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
    Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle
} from "@/components/ui/empty";
import { Link } from "@tanstack/react-router";

function NoEventSelected() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-1 items-center justify-center">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Calendar />
                    </EmptyMedia>
                    <EmptyTitle>{t("no-event-selected")}</EmptyTitle>
                    <EmptyDescription>{t("no-event-selected-description")}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <EmptyDescription>
                        {t("need-help-q")} <Link to="/">{t("contact-support")}</Link>
                    </EmptyDescription>
                </EmptyContent>
            </Empty>
        </div>
    );
}

export default NoEventSelected;
