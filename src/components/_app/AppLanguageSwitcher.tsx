import { Globe } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function AppLanguageSwitcher() {
    const { i18n } = useTranslation();
    const isArabic = i18n.language.startsWith("ar");

    const toggleLanguage = useCallback(() => {
        i18n.changeLanguage(isArabic ? "en-US" : "ar-SA");
    }, [i18n, isArabic]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "l" || event.key === "L") {
                const target = event.target as HTMLElement;
                const tag = target?.tagName;
                if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
                toggleLanguage();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleLanguage]);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={toggleLanguage}>
                    <Globe />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                {isArabic ? "English" : "العربية"} <kbd className="bg-background text-foreground ms-1 rounded border px-1.5 py-0.5 text-[10px] font-medium">L</kbd>
            </TooltipContent>
        </Tooltip>
    );
}

export default AppLanguageSwitcher;
