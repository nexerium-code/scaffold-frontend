import { BarChart3, Briefcase, ClipboardCheck, MessageSquare, Users, Zap } from "lucide-react";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

function Features() {
    const { t } = useTranslation();

    return (
        <section aria-label="Features" className="layout-container overflow-hidden">
            <div className="grid grid-cols-2 border-x border-b lg:grid-cols-3">
                <Card className="hover:bg-muted/40 border-border rounded-none border-t bg-transparent shadow-none ring-0 transition-colors odd:border-e nth-[n+3]:border-t lg:nth-[3n]:border-e-0 lg:nth-[3n-1]:border-e lg:nth-[3n-2]:border-e">
                    <CardHeader>
                        <CardDecorator>
                            <ClipboardCheck className="size-6" />
                        </CardDecorator>
                    </CardHeader>
                    <CardContent className="text-center">
                        <h3 className="mb-2 text-2xl font-bold">{t("feature-attendance-title")}</h3>
                        <p className="text-muted-foreground text-sm">{t("feature-attendance-description")}</p>
                    </CardContent>
                </Card>
                <Card className="hover:bg-muted/40 border-border rounded-none border-t bg-transparent shadow-none ring-0 transition-colors odd:border-e nth-[n+3]:border-t lg:nth-[3n]:border-e-0 lg:nth-[3n-1]:border-e lg:nth-[3n-2]:border-e">
                    <CardHeader>
                        <CardDecorator>
                            <Users className="size-6" />
                        </CardDecorator>
                    </CardHeader>
                    <CardContent className="text-center">
                        <h3 className="mb-2 text-2xl font-bold">{t("feature-participants-title")}</h3>
                        <p className="text-muted-foreground text-sm">{t("feature-participants-description")}</p>
                    </CardContent>
                </Card>
                <Card className="hover:bg-muted/40 border-border rounded-none border-t bg-transparent shadow-none ring-0 transition-colors odd:border-e nth-[n+3]:border-t lg:nth-[3n]:border-e-0 lg:nth-[3n-1]:border-e lg:nth-[3n-2]:border-e">
                    <CardHeader>
                        <CardDecorator>
                            <Briefcase className="size-6" />
                        </CardDecorator>
                    </CardHeader>
                    <CardContent className="text-center">
                        <h3 className="mb-2 text-2xl font-bold">{t("feature-workshops-title")}</h3>
                        <p className="text-muted-foreground text-sm">{t("feature-workshops-description")}</p>
                    </CardContent>
                </Card>
                <Card className="hover:bg-muted/40 border-border rounded-none border-t bg-transparent shadow-none ring-0 transition-colors odd:border-e nth-[n+3]:border-t lg:nth-[3n]:border-e-0 lg:nth-[3n-1]:border-e lg:nth-[3n-2]:border-e">
                    <CardHeader>
                        <CardDecorator>
                            <MessageSquare className="size-6" />
                        </CardDecorator>
                    </CardHeader>
                    <CardContent className="text-center">
                        <h3 className="mb-2 text-2xl font-bold">{t("feature-feedback-title")}</h3>
                        <p className="text-muted-foreground text-sm">{t("feature-feedback-description")}</p>
                    </CardContent>
                </Card>
                <Card className="hover:bg-muted/40 border-border rounded-none border-t bg-transparent shadow-none ring-0 transition-colors odd:border-e nth-[n+3]:border-t lg:nth-[3n]:border-e-0 lg:nth-[3n-1]:border-e lg:nth-[3n-2]:border-e">
                    <CardHeader>
                        <CardDecorator>
                            <Zap className="size-6" />
                        </CardDecorator>
                    </CardHeader>
                    <CardContent className="text-center">
                        <h3 className="mb-2 text-2xl font-bold">{t("feature-customizable-title")}</h3>
                        <p className="text-muted-foreground text-sm">{t("feature-customizable-description")}</p>
                    </CardContent>
                </Card>
                <Card className="hover:bg-muted/40 border-border rounded-none border-t bg-transparent shadow-none ring-0 transition-colors odd:border-e nth-[n+3]:border-t lg:nth-[3n]:border-e-0 lg:nth-[3n-1]:border-e lg:nth-[3n-2]:border-e">
                    <CardHeader>
                        <CardDecorator>
                            <BarChart3 className="size-6" />
                        </CardDecorator>
                    </CardHeader>
                    <CardContent className="text-center">
                        <h3 className="mb-2 text-2xl font-bold">{t("feature-analytics-title")}</h3>
                        <p className="text-muted-foreground text-sm">{t("feature-analytics-description")}</p>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

function CardDecorator({ children }: { children: ReactNode }) {
    return (
        <div className="relative mx-auto size-36 mask-radial-from-40% mask-radial-to-60% duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] dark:opacity-50" />
            <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l">{children}</div>
        </div>
    );
}

export default Features;
