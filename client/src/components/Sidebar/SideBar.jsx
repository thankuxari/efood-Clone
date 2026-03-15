import { sideBarContext } from "../../context/sidebarContext.jsx";
import { useContext } from "react";
import "./sidebar.css";
import AccountSidebar from "./AccountSidebar.jsx";
export default function SideBar({ user, setUser, setShop }) {
    const { setIsOpen, sidebarType } = useContext(sideBarContext);

    return (
        <>
            {sidebarType === "account" && (
                <AccountSidebar
                    user={user}
                    setUser={setUser}
                    setShop={setShop}
                    setIsOpen={setIsOpen}
                />
            )}
        </>
    );
}
