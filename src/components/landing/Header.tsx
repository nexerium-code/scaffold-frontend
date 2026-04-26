import { LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";

import AppLanguageSwitcher from "@/components/_app/AppLanguageSwitcher";
import AppThemeSwitcher from "@/components/_app/AppThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";

function Header() {
    const { t } = useTranslation();

    return (
        <header className="bg-background/60 sticky top-0 z-50 border-b p-0 backdrop-blur">
            <nav aria-label="Main navigation" className="layout-container flex items-center gap-2 p-2 md:px-0">
                <Link to="/" className="me-auto">
                    <span className="ps-4 text-2xl font-extrabold tracking-tight text-balance italic hover:not-italic">SJILY</span>
                </Link>
                <AppLanguageSwitcher />
                <Separator orientation="vertical" className="h-6!" />
                <AppThemeSwitcher />
                <Button asChild>
                    <Link to="/signin">
                        <LogIn className="rtl:rotate-180" /> {t("sign-in")}
                    </Link>
                </Button>
            </nav>
        </header>
    );
}

export default Header;
