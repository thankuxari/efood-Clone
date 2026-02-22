import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../context/userContext";
import "./login.css";

export default function Login() {
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const { setUser } = useContext(userContext);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:8000/v1/api/users/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(form),
                },
            );

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const data = await response.json();
            setUser(data);
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
            <h1>Συνδέσου στον λογαριασμό σου</h1>
            <form action="submit" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="username"
                    name="username"
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
