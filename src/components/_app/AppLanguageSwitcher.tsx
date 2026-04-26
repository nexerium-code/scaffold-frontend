import { Globe } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function AppLanguageSwitcher() {
    const { i18n } = useTranslation();

    const isArabic = i18n.language.startsWith("ar");

    function toggleLanguage() {
        i18n.changeLanguage(isArabic ? "en-US" : "ar-SA");
    }

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "l" || e.key === "L") {
                const tag = (e.target as HTMLElement)?.tagName;
                if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
                toggleLanguage();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

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
