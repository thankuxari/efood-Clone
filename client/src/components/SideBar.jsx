import { useNavigate, Link } from "react-router-dom";
import { sideBarContext } from "../context/sidebarContext.jsx";
import { useContext } from "react";
import "./sidebar.css";
export default function SideBar({ user, setUser, setShop }) {
    const navigate = useNavigate();
    const { setIsOpen } = useContext(sideBarContext);

    async function handleLogout() {
        try {
            const response = await fetch(
                `http://localhost:8000/v1/api/${user ? "users" : "shops"}/logout`,
                {
                    method: "POST",
                    credentials: "include",
                },
            );

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            setUser(null);
            setShop(null);
            setIsOpen(false);
            navigate("/");
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}>
            <div className="sidebar" onClick={(e) => e.stopPropagation()}>
                <Link>Οι παραγγελίες μου</Link>
                <Link to="/user_settings">Ρυθμίσεις Λογαριασμόυ</Link>
                <Link>Ειδοποιήσεις</Link>
                <button onClick={handleLogout} className="primary-button">
                    Logout
                </button>
            </div>
        </div>
    );
}
