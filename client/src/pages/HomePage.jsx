import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

    return (
        <>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <div>
                    <h1>{shops.length} Καταστήματα</h1>
                    <div>
                        {shops.map(({ _id, shop_name }) => (
                            <Link key={_id} to={`shops/${_id}`}>
                                {shop_name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
