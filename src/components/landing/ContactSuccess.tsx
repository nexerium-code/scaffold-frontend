import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type ContactSuccessProps = {
    onReset: () => void;
};

function ContactSuccess({ onReset }: ContactSuccessProps) {
    const { t } = useTranslation();

    return (
        <div className="flex items-start justify-center border-x border-t">
            <Card className="w-full max-w-lg bg-transparent shadow-none ring-0">
                <CardContent className="flex flex-col items-center justify-center gap-7">
                    <DotLottieReact className="size-64" src="/lottie-success.json" autoplay />
                    <div className="space-y-4">
                        <h3 className="text-center text-2xl font-semibold tracking-tight">{t("contact-success-title")}</h3>
                        <p className="text-muted-foreground text-md">{t("contact-success-description")}</p>
                    </div>
                    <Button className="w-full" size="lg" onClick={onReset}>
                        {t("contact-send-another")}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default ContactSuccess;
