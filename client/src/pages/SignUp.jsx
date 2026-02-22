import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { userContext } from "../context/userContext";
import "./signup.css";

export default function SignUp() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const { setUser } = useContext(userContext);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8000/v1/api/users/signup",

                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
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
        <div className="signup-container">
            <h1>Νέος χρήστης?</h1>
            <h5>Κάνε εγγραφή τώρα </h5>
            <form action="submit" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="username"
                    name="username"
                    onChange={handleChange}
                />
                <input
                    type="email"
                    placeholder="email"
                    name="email"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="password"
                    name="password"
                    onChange={handleChange}
                />
                <button type="submit" className="primary-button">
                    Εγγραφή
                </button>
            </form>
            <p>
                Έχεις ήδη λογαριασμό? Συνδέσου αμέσως παντώντας{" "}
                <Link to="/login">εδώ</Link>
            </p>
        </div>
    );
}
