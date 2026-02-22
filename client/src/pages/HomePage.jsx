import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./homepage.css";

export default function HomePage() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getShops() {
            setLoading(true);
            try {
                const response = await fetch(
                    "http://localhost:8000/v1/api/shops/",
                );

                if (!response.ok)
                    throw new Error(`HTTP Error: ${response.status}`);

                const data = await response.json();
                setShops(data);
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }
        getShops();
    }, []);

    if (loading) return <h1>Loading...</h1>;

    return (
        <div className="homepage-container">
            <h1>{shops.length} Καταστήματα</h1>
            <div className="shop-grid">
                {shops.map(({ _id, shop_name }) => (
                    <Link key={_id} to={`shops/${_id}`} className="shop-card">
                        <img src="/shop_default_banner.jpg" alt="" />
                        <h5>{shop_name}</h5>
                    </Link>
                ))}
            </div>
        </div>
    );
}
