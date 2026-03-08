import "./productcard.css";
import formatMoney from "../utils/formatMoney.js";
import { useContext } from "react";
import { sideBarContext } from "../context/sidebarContext.jsx";
export default function ProductCard({
    _id,
    product_name,
    price,
    product_image,
}) {
    const { isOpen, setIsOpen, setSideBarType } = useContext(sideBarContext);

    return (
        <div className="shop-product-card" key={_id}>
            <div>
                <h3>{product_name}</h3>
                <h4>{formatMoney(price)}</h4>
            </div>
            <div className="shop-product-image-container">
                <img
                    src={
                        product_image
                            ? product_image
                            : "/shop_default_banner.jpg"
                    }
                    alt=""
                />
                <i
                    class="fa-solid fa-plus"
                    onClick={() => {
                        setSideBarType("cart");
                        setIsOpen(!isOpen);
                    }}
                ></i>
            </div>
        </div>
    );
}
