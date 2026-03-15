import { useContext } from "react";
import { cartContext } from "../../context/cartContext.jsx";
import formatMoney from "../../utils/formatMoney.js";
import "./cartsidebar.css";

export default function CartSidebar() {
    const { cart, loading } = useContext(cartContext);

    let totalSum = 0;
    for (let i = 0; i < cart.length; i++) {
        totalSum += cart[i].price * cart[i].quantity;
    }

    console.log(cart);

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
                                <h4>{formatMoney(product.price)}</h4>
                            </div>

                            <div>
                                <img src={product.product_image} alt="" />
                            </div>
                        </div>
                    ))}

                    <div className="cart-order-summary-container">
                        <div>
                            <h3>Σύνολο πληρωμής: {formatMoney(totalSum)}</h3>
                        </div>
                        <button className="primary-button">
                            Ολοκλήρωση Παραγγελίας
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
