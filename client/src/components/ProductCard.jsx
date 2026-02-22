import "./productcard.css";
import formatMoney from "../utils/formatMoney.js";

export default function ProductCard({ _id, product_name, price }) {
    return (
        <div className="shop-product-card" key={_id}>
            <div>
                <h3>{product_name}</h3>
                <h4>{formatMoney(price)}</h4>
            </div>
            <img src="/shop_default_banner.jpg" alt="" />
        </div>
    );
}
