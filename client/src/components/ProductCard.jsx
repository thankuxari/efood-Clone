import "./productcard.css";
import formatMoney from "../utils/formatMoney.js";
import { useContext } from "react";
import { cartContext } from "../context/cartContext.jsx";
export default function ProductCard({
    _id,
    product_name,
    price,
    product_description,
    product_image,
}) {
    const { addToCart } = useContext(cartContext);

    function handleAddToCart() {
        addToCart({ _id, product_name, price, product_image });
    }

    return (
        <div className="shop-product-card" key={_id}>
            <div className="text-information-container">
                <h3>{product_name}</h3>
                <h3 className="description">{product_description}</h3>
                <h4>{formatMoney(price)}</h4>
            </div>
            <div className="shop-product-image-container">
                {product_image && <img src={product_image} alt="" />}
                <i className="fa-solid fa-plus" onClick={handleAddToCart}></i>
            </div>
        </div>
    );
}
