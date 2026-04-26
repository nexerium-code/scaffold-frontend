import { useTranslation } from "react-i18next";

import Squares from "@/components/general/Squares";
import IntegrationFlow from "@/components/landing/IntegrationFlow";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const INTEGRATIONS = [
    { key: "aws", src: "/images/aws.svg" },
    { key: "netlify", src: "/images/netlify.svg" },
    { key: "mongodb-atlas", src: "/images/mongodb.svg" },
    { key: "clerk", src: "/images/clerk.png" },
    { key: "twilio", src: "/images/twilio.png" },
    { key: "placid", src: "/images/placid.png" },
    { key: "replit", src: "/images/replit.svg" },
    { key: "sentry", src: "/images/sentry.png" }
];

function Integrations() {
    const { t } = useTranslation();

    return (
        <section aria-label="Integrations" className="layout-container overflow-hidden">
            <div className="relative h-70 border-x">
                <Squares direction="diagonal" speed={0.2} squareSize={30} />
                <div className="pointer-events-none absolute inset-0 z-10 p-12">
                    <p className="text-muted-foreground text-sm font-semibold tracking-tight text-balance uppercase">{t("integrations-subtitle")}</p>
                    <h2 className="mt-2 text-4xl leading-tight font-extrabold text-balance md:text-5xl lg:text-6xl">{t("integrations-title")}</h2>
                    <p className="text-muted-foreground max-w-md text-xl">{t("integrations-description")}</p>
                </div>
            </div>
            <div className="border-x border-t px-6 py-10">
                <IntegrationFlow />
            </div>
            <div className="grid grid-cols-1 border-x border-b md:grid-cols-2">
                {INTEGRATIONS.map(({ key, src }) => (
                    <Card key={key} className="hover:bg-muted/40 border-border rounded-none border-t bg-transparent shadow-none ring-0 transition-colors md:odd:border-e">
                        <CardHeader>
                            <img src={src} alt={t(`integration-${key}`)} className="size-8" />
                        </CardHeader>
                        <CardContent>
                            <h3 className="mb-2 text-2xl font-bold">{t(`integration-${key}`)}</h3>
                            <p className="text-muted-foreground text-sm">{t(`integration-${key}-description`)}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}

export default Integrations;
