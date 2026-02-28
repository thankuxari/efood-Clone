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

    console.log(shops);

    return (
        <div className="homepage-container">
            <h1>{shops.length} Καταστήματα</h1>
            <div className="shop-grid">
                {shops.map(
                    ({
                        _id,
                        shop_name,
                        shop_category,
                        shop_logo,
                        shop_banner,
                    }) => (
                        <Link
                            key={_id}
                            to={`shops/${_id}`}
                            className="shop-card"
                        >
                            <div className="top-container">
                                <img
                                    src={
                                        !shop_banner
                                            ? "/shop_default_banner.jpg"
                                            : shop_banner
                                    }
                                    alt=""
                                />
                                <img
                                    className="shop-logo"
                                    src={
                                        !shop_logo
                                            ? "/shop_default_profile.jpg"
                                            : shop_logo
                                    }
                                    alt=""
                                />
                            </div>
                            <div className="bottom-container">
                                <h5>{shop_name}</h5>
                                <span>
                                    {!shop_category
                                        ? "Κατάστημα"
                                        : shop_category}
                                </span>
                            </div>
                        </Link>
                    ),
                )}
            </div>
        </div>
    );
}
