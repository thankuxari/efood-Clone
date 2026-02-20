import { createContext, useState } from "react";

export const modalContext = createContext(false);

export function ModalProvider({ children }) {
    const [openModal, setOpenModal] = useState(false);

    return (
        <modalContext.Provider value={{ openModal, setOpenModal }}>
            {children}
        </modalContext.Provider>
    );
}
