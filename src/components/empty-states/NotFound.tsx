import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-dvh items-center justify-center p-6">
            <Empty>
                <EmptyHeader>
                    <EmptyTitle>{t("not-found-title")}</EmptyTitle>
                    <EmptyDescription>{t("not-found-description")}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button size="lg" asChild>
                        <Link to="/">{t("go-to-home")}</Link>
                    </Button>
                    <EmptyDescription>
                        {t("need-help-q")} <Link to="/">{t("contact-support")}</Link>
                    </EmptyDescription>
                </EmptyContent>
            </Empty>
        </div>
    );
}

export default NotFound;
