import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cartContext } from "../../context/cartContext";

export default function AccountSidebar({
    user,
    setUser,
    setShop,
    setIsOpen,
    isOpen,
}) {
    const { setCart } = useContext(cartContext);
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            const endpoint = user ? "users/logout" : "shops/logout";

            const response = await fetch(
                `http://localhost:8000/v1/api/${endpoint}`,
                {
                    method: "POST",
                    credentials: "include",
                },
            );

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            setUser(null);
            setShop(null);
            setCart([]);
            setIsOpen(false);

            navigate("/", { replace: true });
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <div
            className={`sidebar-overlay ${isOpen ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
        >
            <div className="sidebar" onClick={(e) => e.stopPropagation()}>
                <Link to="/orders" onClick={() => setIsOpen(false)}>
                    Οι παραγγελίες μου
                </Link>

                <Link to="/user_settings" onClick={() => setIsOpen(false)}>
                    Ρυθμίσεις Λογαριασμού
                </Link>

                <Link to="/notifications" onClick={() => setIsOpen(false)}>
                    Ειδοποιήσεις
                </Link>

                <button onClick={handleLogout} className="primary-button">
                    Logout
                </button>
            </div>
        </div>
    );
}
