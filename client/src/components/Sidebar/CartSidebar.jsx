import { useContext } from "react";
import { cartContext } from "../../context/cartContext.jsx";
import { Link } from "react-router-dom";
import calculateCartTotalSum from "../../utils/calculateCartTotalSum.js";
import calculateCartSingleItemSum from "../../utils/calculateCartSingleItemSum.js";
import { enqueueSnackbar } from "notistack";
import "./cartsidebar.css";

export default function CartSidebar() {
    const { cart, setCart, loading } = useContext(cartContext);

    function handleCartQuantityChange(productId, newQuantity) {
        const newCart = cart.map((item) =>
            item.product_id === productId
                ? { ...item, quantity: newQuantity }
                : item,
        );

        setCart(newCart);
        async function updateCartQuantity() {
            try {
                const response = await fetch(
                    "http://localhost:8000/v1/api/users/update_cart_quantity",
                    {
                        method: "PATCH",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            product_id: productId,
                            updatedQuantity: newQuantity,
                        }),
                    },
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error);
                }
            } catch (err) {
                console.error(err.message);
            }
        }

        updateCartQuantity();
    }

    async function handleCartDelete(productId) {
        const newCart = cart.filter(
            (product) => product.product_id !== productId,
        );
        setCart(newCart);

        async function handleCartDeletion() {
            try {
                const response = await fetch(
                    "http://localhost:8000/v1/api/users/delete_item",
                    {
                        method: "DELETE",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ productId }),
                    },
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message);
                }
            } catch (err) {
                console.error(err.message);
                enqueueSnackbar(err.message, { variant: "error" });
            }
        }

        handleCartDeletion();
    }

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
                                    onChange={(e) =>
                                        handleCartQuantityChange(
                                            product.product_id,
                                            Number(e.target.value),
                                        )
                                    }
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

                            <div className="shop-product-image-container">
                                {product.product_image && (
                                    <img src={product.product_image} alt="" />
                                )}
                                <i
                                    className="fa-solid fa-minus"
                                    onClick={() =>
                                        handleCartDelete(product.product_id)
                                    }
                                ></i>
                            </div>
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
