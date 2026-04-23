import { useContext } from "react";
import { cartContext } from "../../context/cartContext.jsx";
import { Link } from "react-router-dom";
import calculateCartTotalSum from "../../utils/calculateCartTotalSum.js";
import calculateCartSingleItemSum from "../../utils/calculateCartSingleItemSum.js";
import "./cartsidebar.css";

export default function CartSidebar() {
    const { cart, loading } = useContext(cartContext);

    return (
        <div className="cart-sidebar">
            <h3>Καλάθι</h3>

            {loading ? (
                <div className="cart-loading">Φορτώνει...</div>
            ) : cart.length === 0 ? (
                <div className="empty-cart">Το καλάθι σου είναι άδειο!</div>
            ) : (
                <>
                    {cart.map((product) => (
                        <div className="product-card" key={product.product_id}>
                            <div>
                                <select
                                    className="quantity-view"
                                    value={product.quantity}
                                >
                                    {[...Array(product.quantity)].map(
                                        (_, i) => (
                                            <option key={i} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>

                            <div>
                                <h3>{product.product_name}</h3>
                                <h4>{calculateCartSingleItemSum(product)}</h4>
                            </div>

                            {product?.product_image && (
                                <img src={product.product_image} alt="" />
                            )}
                        </div>
                    ))}

                    <div className="cart-order-summary-container">
                        <div>
                            <h3>
                                Σύνολο πληρωμής: {calculateCartTotalSum(cart)}
                            </h3>
                        </div>
                        <Link
                            to={"/complete_order/"}
                            className="primary-button"
                        >
                            Ολοκλήρωση Παραγγελίας
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
