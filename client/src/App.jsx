import Navbar from "./components/Navbar.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import HomePage from "./pages/HomePage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import { userContext } from "./context/userContext.jsx";
import { Routes, Route } from "react-router-dom";
import { useContext } from "react";
import SignUpShops from "./pages/SignUpShops.jsx";

function App() {
    const { user } = useContext(userContext);

    return (
        <>
            <Navbar />
            <Routes>
                <Route
                    path="/"
                    element={user ? <HomePage /> : <WelcomePage />}
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="shops/:id" element={<ShopPage />} />
                <Route path="/signup_shops" element={<SignUpShops />} />
            </Routes>
        </>
    );
}

export default App;
