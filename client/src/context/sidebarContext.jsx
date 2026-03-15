import { createContext, useState } from "react";

export const sideBarContext = createContext(false);

export function SideBarProvider({ children }) {
    const [sidebarType, setSideBarType] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <sideBarContext.Provider
            value={{ isOpen, setIsOpen, sidebarType, setSideBarType }}
        >
            {children}
        </sideBarContext.Provider>
    );
}
