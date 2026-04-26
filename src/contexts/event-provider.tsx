import { createContext, ReactNode, useContext, useState } from "react";

interface EventContextType {
    selectedEvent: string;
    setSelectedEvent: (event: string) => void;
}

const EventContext = createContext<EventContextType>({
    selectedEvent: "",
    setSelectedEvent: (event: string) => {
        throw new Error(`setSelectedEvent (${event}) function must be overridden`);
    }
});

function EventProvider(props: { children: ReactNode }) {
    const [selectedEvent, setSelectedEvent] = useState<string>(() => {
        const currentEvent = localStorage.getItem("selectedEvent");
        return currentEvent || "";
    });

    function handleSelect(selected: string) {
        if (selectedEvent === selected) {
            setSelectedEvent("");
            localStorage.removeItem("selectedEvent");
        } else {
            setSelectedEvent(selected);
            if (selected) {
                localStorage.setItem("selectedEvent", selected);
            }
        }
    }

    return <EventContext.Provider value={{ selectedEvent, setSelectedEvent: handleSelect }}>{props.children}</EventContext.Provider>;
}

function useSelectedEvent() {
    const context = useContext(EventContext);
    if (context === undefined) throw new Error("Context usage prohibited in the current placement");
    return context;
}

export { EventProvider, useSelectedEvent };
