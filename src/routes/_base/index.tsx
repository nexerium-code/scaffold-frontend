import { ArrowRight, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_base/")({
    component: Index
});

function Index() {
    const { t } = useTranslation();

    return (
        <main className="flex min-h-svh flex-col">
            <header className="flex h-14 items-center justify-between border-b px-4 md:px-6">
                <Link to="/" className="text-xl font-extrabold tracking-tight italic">
                    {t("scaffold")}
                </Link>
                <Button asChild>
                    <Link to="/signin">
                        {t("signin")}
                        <ArrowRight data-icon="inline-end" className="rtl:rotate-180" />
                    </Link>
                </Button>
            </header>
            <section className="flex flex-1 items-center">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 md:px-6">
                    <div className="flex max-w-2xl flex-col gap-4">
                        <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                            <ShieldCheck />
                            {t("starter-template")}
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl">{t("landing-title")}</h1>
                        <p className="text-muted-foreground max-w-xl text-lg text-pretty">{t("landing-description")}</p>
                    </div>
                    <div className="grid grid-cols-1 divide-y rounded-md border md:grid-cols-3 md:divide-x md:divide-y-0">
                        <div className="flex flex-col gap-2 px-6 py-5">
                            <h2 className="font-medium">{t("architecture")}</h2>
                            <p className="text-muted-foreground text-sm">{t("architecture-description")}</p>
                        </div>
                        <div className="flex flex-col gap-2 px-6 py-5">
                            <h2 className="font-medium">{t("patterns")}</h2>
                            <p className="text-muted-foreground text-sm">{t("patterns-description")}</p>
                        </div>
                        <div className="flex flex-col gap-2 px-6 py-5">
                            <h2 className="font-medium">{t("examples")}</h2>
                            <p className="text-muted-foreground text-sm">{t("examples-description")}</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
