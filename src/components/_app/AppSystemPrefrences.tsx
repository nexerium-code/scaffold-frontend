import { Info, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from "@/contexts/theme-provider";

function AppSystemPrefrences() {
    const { i18n } = useTranslation();
    const { theme, setTheme } = useTheme();

    return (
        <SidebarMenu className="gap-2">
            <SidebarMenuItem className="rounded-md border">
                <ToggleGroup
                    type="single"
                    size="sm"
                    className="w-full"
                    value={theme}
                    onValueChange={(value) => {
                        if (value) setTheme(value as "light" | "dark");
                    }}
                    dir="ltr"
                >
                    <ToggleGroupItem value="light" className="flex-1">
                        <Sun />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="dark" className="flex-1">
                        <Moon />
                    </ToggleGroupItem>
                </ToggleGroup>
            </SidebarMenuItem>
            <SidebarMenuItem className="rounded-md border">
                <ToggleGroup
                    type="single"
                    size="sm"
                    className="w-full"
                    value={i18n.language}
                    onValueChange={(value) => {
                        if (value) i18n.changeLanguage(value);
                    }}
                    dir="ltr"
                >
                    <ToggleGroupItem value="en-US" className="flex-1 text-xs">
                        English
                    </ToggleGroupItem>
                    <ToggleGroupItem value="ar-SA" className="flex-1 text-xs">
                        العربية
                    </ToggleGroupItem>
                </ToggleGroup>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <div className="mt-2 flex items-center justify-between gap-2">
                    <h3 className="text-2xl font-extrabold tracking-tight text-balance italic">SJILY</h3>
                    <Info className="size-4" />
                </div>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export default AppSystemPrefrences;
