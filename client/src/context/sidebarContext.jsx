import { createContext, useState } from "react";

export const sideBarContext = createContext(false);

export function SideBarProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <sideBarContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </sideBarContext.Provider>
    );
}
