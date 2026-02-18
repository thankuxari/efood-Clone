import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useContext, useState } from "react";
import { userContext } from "../context/userContext.jsx";
import SideBar from "./SideBar.jsx";
import { shopContext } from "../context/shopContext.jsx";

export default function Navbar() {
    const [sideBar, setSideBar] = useState(false);
    const { user, setUser } = useContext(userContext);
    const { shop, setShop } = useContext(shopContext);
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            const response = await fetch(
                "http://localhost:8000/v1/api/users/logout",
                {
                    method: "POST",
                    credentials: "include",
                },
            );

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            setUser(null);
            navigate("/");
        } catch (err) {
            console.error(err.message);
        }
    }

    console.log(shop);

    return (
        <>
            <header>
                <nav>
                    <Link to={"/"}>
                        <img src="/logo.png" alt="" />
                    </Link>
                    {(user || shop) && (
                        <form action="">
                            <input
                                className="search-bar-input"
                                type="search"
                                placeholder="Αναζήτηση"
                            />
                        </form>
                    )}
                    <ul>
                        {user || shop ? (
                            <>
                                <Link
                                    className="user-info-container"
                                    onClick={() => setSideBar(true)}
                                >
                                    <img
                                        className="user-profile-image"
                                        src="/user_profile.png"
                                        alt=""
                                    />
                                    <h5>
                                        {user ? user.username : shop.shop_name}
                                    </h5>
                                </Link>
                                <button onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to={"/about"}>
                                    Μάθε Περισσότερα για αυτό το project
                                </Link>
                                <Link to="/signup_shops">
                                    Έχεις κατάστημα? Γίνε συνεργάτης
                                </Link>
                                <Link to={"/signup"}>Είσοδος / Εγγραφή</Link>
                            </>
                        )}
                    </ul>
                </nav>
                {/* {sideBar && <SideBar user={user} />} */}
            </header>
        </>
    );
}
