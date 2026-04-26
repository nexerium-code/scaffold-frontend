import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type ScopeContextType = {
    selectedScope: string;
    setSelectedScope: (scope: string) => void;
};

const ScopeContext = createContext<ScopeContextType | undefined>(undefined);

function ScopeProvider(props: { children: ReactNode }) {
    const [selectedScope, setSelectedScope] = useState<string>(() => {
        const currentScope = localStorage.getItem("selectedScope");
        return currentScope || "";
    });

    function handleSelect(selected: string) {
        if (selectedScope === selected) {
            setSelectedScope("");
            localStorage.removeItem("selectedScope");
            return;
        }

        setSelectedScope(selected);
        if (selected) localStorage.setItem("selectedScope", selected);
    }

    return <ScopeContext.Provider value={{ selectedScope, setSelectedScope: handleSelect }}>{props.children}</ScopeContext.Provider>;
}

function useSelectedScope() {
    const context = useContext(ScopeContext);
    if (context === undefined) throw new Error("useSelectedScope must be used within a ScopeProvider");
    return context;
}

export { ScopeProvider, useSelectedScope };
