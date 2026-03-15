import { Link } from "react-router-dom";
import "./navbar.css";
import { useContext } from "react";
import { userContext } from "../context/userContext.jsx";
import { shopContext } from "../context/shopContext.jsx";
import { sideBarContext } from "../context/sidebarContext.jsx";
import SideBar from "./Sidebar/SideBar.jsx";

export default function Navbar() {
    const { user, setUser } = useContext(userContext);
    const { shop, setShop } = useContext(shopContext);
    const { isOpen, setIsOpen, setSideBarType } = useContext(sideBarContext);

    return (
        <>
            <header>
                <nav>
                    <Link className="logo-container" to={"/"}>
                        <img src="/logo.png" alt="" />
                        {shop && <h3>PARTNER</h3>}
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
                                <button
                                    className="user-info-container"
                                    onClick={() => {
                                        setIsOpen(!isOpen);
                                        setSideBarType("account");
                                    }}
                                >
                                    <img
                                        className="user-profile-image"
                                        src="/user_profile.png"
                                        alt=""
                                    />
                                    <h5>
                                        {user ? user.username : shop.shop_name}
                                    </h5>
                                </button>
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
                {isOpen && (
                    <SideBar user={user} setUser={setUser} setShop={setShop} />
                )}
            </header>
        </>
    );
}
