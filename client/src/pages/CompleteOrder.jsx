import { useContext, useState } from "react";
import { cartContext } from "../context/cartContext";
import calculateCartSingleItemSum from "../utils/calculateCartSingleItemSum";
import calculateCartTotalSum from "../utils/calculateCartTotalSum";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import "./completeorder.css";

export default function CompleteOrder() {
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [address, setAddress] = useState(null);
    const { cart, setCart } = useContext(cartContext);
    console.log(cart);
    const navigate = useNavigate();

    function handlePaymentChange(e) {
        setPaymentMethod(e.target.value);
    }

    function handleAddressChange(e) {
        setAddress(e.target.value);
    }

    async function handleCompleteOrder(e) {
        e.preventDefault();
        try {
            const response = await fetch(
                "http://localhost:8000/v1/api/users/complete_order",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        address,
                        paymentMethod,
                        cart,
                        totalPrice: calculateCartTotalSum(cart),
                    }),
                },
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            setCart([]);
            navigate("/thank_you");
        } catch (err) {
            console.error(err.message);
            enqueueSnackbar(err.message, { variant: "error" });
        }
    }

    return (
        <form
            className="complete-order-container"
            onSubmit={handleCompleteOrder}
        >
            <div className="order-left-container">
                <h2 className="order-title">Παραγγελία</h2>

                <div className="address-container">
                    <h4>Διεύθυνση</h4>
                    <input
                        type="text"
                        id="address"
                        placeholder="Διεύθυνση"
                        onChange={handleAddressChange}
                    />
                </div>
                <div className="payment-container">
                    <h4>
                        Τρόπος πληρωμής
                        {paymentMethod ? ":" + paymentMethod : ""}
                    </h4>
                    <select onChange={handlePaymentChange}>
                        <option value="">Διάλεξε τρόπο πληρωμής</option>
                        <option value="cash">Μετρητά</option>
                        <option value="card">Κάρτα</option>
                        <option value="gift-card">Gift-Card</option>
                    </select>
                </div>
            </div>
            <div className="order-right-container">
                <h2 className="order-title">Καλάθι</h2>
                <h4>Περίλιψη παραγγελίας</h4>
                {cart.map((product) => (
                    <div className="product-card">
                        <div>
                            <h3>{product.product_name}</h3>
                            <h4>{calculateCartSingleItemSum(product)}</h4>
                        </div>

                        <div>
                            <img src={product.product_image} alt="" />
                        </div>
                    </div>
                ))}
                <div>Σύνολο παραγγελίας: {calculateCartTotalSum(cart)}</div>
                <button type="submit" className="primary-button">
                    Ολοκλήρωση παραγγελίας
                </button>
            </div>
        </form>
    );
}
