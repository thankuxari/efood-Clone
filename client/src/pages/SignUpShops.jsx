import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { shopContext } from "../context/shopContext.jsx";

export default function SignUpShops() {
    const [form, setForm] = useState({
        shop_name: "",
        email: "",
        password: "",
    });

    const { setShop } = useContext(shopContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8000/v1/api/shops/signup",

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
        <>
            <h1>Έχεις κατάστημα?</h1>
            <h5>Κάνε εγγραφή τώρα!</h5>
            <form action="submit" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="username"
                    name="shop_name"
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
                <button type="submit">Εγγραφή</button>
            </form>
            <h5>
                Έχεις ήδη λογαριασμό καταστήματος? Συνδέσου αμέσως παντώντας{" "}
                <Link to="/login_shop">εδώ</Link>
            </h5>
        </>
    );
}
