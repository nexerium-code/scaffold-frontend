import { Moon } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/theme-provider";

function AppThemeSwitcher() {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();

    const toggleTheme = useCallback(() => {
        setTheme(theme === "dark" ? "light" : "dark");
    }, [setTheme, theme]);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "d" || event.key === "D") {
                const target = event.target as HTMLElement;
                const tag = target?.tagName;
                if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
                toggleTheme();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleTheme]);

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
