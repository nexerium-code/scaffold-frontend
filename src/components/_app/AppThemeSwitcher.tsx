import { Moon } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/theme-provider";

function AppThemeSwitcher() {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();

    function toggleTheme() {
        setTheme(theme === "dark" ? "light" : "dark");
    }

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === "d" || e.key === "D") {
                const tag = (e.target as HTMLElement)?.tagName;
                if (tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable) return;
                toggleTheme();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" onClick={toggleTheme}>
                    <Moon />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                {t("theme")} <kbd className="bg-background text-foreground ms-1 rounded border px-1.5 py-0.5 text-[10px] font-medium">D</kbd>
            </TooltipContent>
        </Tooltip>
    );
}

export default AppThemeSwitcher;
