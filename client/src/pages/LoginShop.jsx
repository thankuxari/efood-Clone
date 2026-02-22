import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { shopContext } from "../context/shopContext";
import "./login.css";

export default function LoginShop() {
    const [form, setForm] = useState({
        shop_name: "",
        password: "",
    });

    const { setShop } = useContext(shopContext);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:8000/v1/api/shops/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(form),
                },
            );

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const data = await response.json();
            setShop(data);
            navigate("/");
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    return (
        <div className="login-container">
            <h1>Έχεις λογαριασμό καταστήματος?</h1>
            <form action="submit" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="username"
                    name="shop_name"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="password"
                    name="password"
                    onChange={handleChange}
                />
                <button type="submit" className="primary-button">
                    Συνδέσου
                </button>
            </form>
            <p>
                Δεν έχεις λογαριασμό? Δημιούργησε έναν αμέσως παντώντας{" "}
                <Link to="/signup">εδώ</Link>
            </p>
        </div>
    );
}
