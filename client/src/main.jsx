import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/userContext.jsx";
import App from "./App.jsx";
import "./index.css";
import { ShopProvider } from "./context/shopContext.jsx";
import { ModalProvider } from "./context/modalContext.jsx";
import { SideBarProvider } from "./context/sidebarContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <UserProvider>
                <ShopProvider>
                    <ModalProvider>
                        <SideBarProvider>
                            <App />
                        </SideBarProvider>
                    </ModalProvider>
                </ShopProvider>
            </UserProvider>
        </BrowserRouter>
    </StrictMode>,
);
