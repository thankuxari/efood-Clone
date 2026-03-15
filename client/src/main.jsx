import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { UserProvider } from "./context/userContext.jsx";
import App from "./App.jsx";
import "./index.css";
import { ShopProvider } from "./context/shopContext.jsx";
import { ModalProvider } from "./context/modalContext.jsx";
import { SideBarProvider } from "./context/sidebarContext.jsx";
import { CartProvider } from "./context/cartContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <SnackbarProvider autoHideDuration={3000}>
            <BrowserRouter>
                <UserProvider>
                    <ShopProvider>
                        <CartProvider>
                            <ModalProvider>
                                <SideBarProvider>
                                    <App />
                                </SideBarProvider>
                            </ModalProvider>
                        </CartProvider>
                    </ShopProvider>
                </UserProvider>
            </BrowserRouter>
        </SnackbarProvider>
    </StrictMode>,
);
