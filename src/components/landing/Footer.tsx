import { useTranslation } from "react-i18next";

import { Link } from "@tanstack/react-router";

function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="layout-container flex items-center justify-between gap-2 border-x border-t p-3">
            <Link to="/">
                <span className="text-2xl font-extrabold tracking-tight text-balance italic hover:not-italic">SJILY</span>
            </Link>
            <p className="text-muted-foreground text-sm">{t("footer-copyright", { year: new Date().getFullYear() })}</p>
        </footer>
    );
}

export default Footer;
