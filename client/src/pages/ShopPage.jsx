import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard.jsx";
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
                    <img
                        src={
                            !shopInfo.shop_banner
                                ? "/shop_default_banner.jpg"
                                : shopInfo.shop_banner
                        }
                        alt=""
                    />
                </div>
                <div className="lower-container">
                    <img src="/shop_default_profile.jpg" alt="" />
                    <div className="text-container">
                        <h3>{shopInfo.shop_name}</h3>
                        <h5>{shopInfo.shop_category}</h5>
                    </div>
                    <div className="action-container">
                        <span>
                            <i className="fa-regular fa-heart"></i>
                        </span>
                        <span>
                            <i className="fa-solid fa-info"></i>
                        </span>
                    </div>
                </div>
            </div>
            <div className="products-shop-grid">
                {shopProducts.map((product) => (
                    <ProductCard
                        key={product._id}
                        _id={product._id}
                        product_name={product.product_name}
                        price={product.price}
                        product_image={product.product_image}
                    />
                ))}
            </div>
        </>
    );
}
