import Navbar from "./components/Navbar.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import HomePage from "./pages/HomePage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { userContext } from "./context/userContext.jsx";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import SignUpShops from "./pages/SignUpShops.jsx";
import LoginShop from "./pages/LoginShop.jsx";
import { shopContext } from "./context/shopContext.jsx";

function App() {
    const { user } = useContext(userContext);
    const { shop } = useContext(shopContext);

    return (
        <>
            <Navbar />
            <Routes>
                <Route
                    path="/"
                    element={
                        user || shop ? (
                            user ? (
                                <HomePage />
                            ) : (
                                <Dashboard />
                            )
                        ) : (
                            <WelcomePage />
                        )
                    }
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="shops/:id" element={<ShopPage />} />
                <Route path="/signup_shops" element={<SignUpShops />} />
                <Route path="/login_shop" element={<LoginShop />} />
            </Routes>
        </>
    );
}

export default App;
