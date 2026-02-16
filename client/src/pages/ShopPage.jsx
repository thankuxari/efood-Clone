import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./shoppage.css";

export default function ShopPage() {
    const { id } = useParams();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getShopInformation() {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:8000/v1/api/shops/${id}`,
                );

                if (!response.ok)
                    throw new Error(`HTTP Error: ${response.status}`);

                const data = await response.json();
                setShop(data);
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        }
        getShopInformation();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!shop) return <div>No shop was found!</div>;

    const { shopInfo, shopProducts } = shop;

    return (
        <>
            <Link to="/">&larr; Πίσω</Link>
            <div className="shop-info-container">
                <div className="top-container">
                    <img src="/shop_default_banner.jpg" alt="" />
                </div>
                <div className="lower-container">
                    <img src="/shop_default_profile.jpg" alt="" />
                    <div className="text-container">
                        <h3>{shopInfo.shop_name}</h3>
                        <h5>{shopInfo.created_at}</h5>
                    </div>
                </div>
            </div>
            <div>
                {shopProducts.map((product) => (
                    <div key={product._id}>
                        <h3>{product.product_name}</h3>
                        <h5>{product.price}</h5>
                    </div>
                ))}
            </div>
        </>
    );
}
