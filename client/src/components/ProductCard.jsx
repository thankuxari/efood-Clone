import "./productcard.css";
import formatMoney from "../utils/formatMoney.js";

export default function ProductCard({
    _id,
    product_name,
    price,
    product_image,
}) {
    return (
        <div className="shop-product-card" key={_id}>
            <div>
                <h3>{product_name}</h3>
                <h4>{formatMoney(price)}</h4>
            </div>
            <img
                src={
                    !product_image ? "/shop_default_banner.jpg" : product_image
                }
                alt=""
            />
        </div>
    );
}
