import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Link } from "@tanstack/react-router";

function GenericError() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-1 items-center justify-center p-6">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia className="bg-destructive/20 text-destructive" variant="icon">
                        <AlertCircle />
                    </EmptyMedia>
                    <EmptyTitle>{t("something-went-wrong")}</EmptyTitle>
                    <EmptyDescription>{t("unexpected-error-description")}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button size="lg" onClick={() => window.location.replace("/dashboard")}>
                        {t("reload")}
                    </Button>
                    <EmptyDescription>
                        {t("need-help-q")} <Link to="/">{t("contact-support")}</Link>
                    </EmptyDescription>
                </EmptyContent>
            </Empty>
        </div>
    );
}

export default GenericError;
