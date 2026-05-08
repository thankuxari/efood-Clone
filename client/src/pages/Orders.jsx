import { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import formatMoney from "../utils/formatMoney";
import "./orders.css";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [openOrderId, setOpenOrderId] = useState(null);

    useEffect(() => {
        async function getUserPastOrders() {
            try {
                const response = await fetch(
                    "http://localhost:8000/v1/api/users/get_orders",
                    {
                        method: "GET",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                    },
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message);
                }

                const data = await response.json();
                setOrders(data);
            } catch (err) {
                console.error(err.message);
                enqueueSnackbar(err.message, { variant: "error" });
            }
        }
        getUserPastOrders();
    }, []);

    const toggleOrder = (id) => {
        setOpenOrderId(openOrderId === id ? null : id);
    };

    console.log(orders);
    return (
        <div className="orders-container">
            <h3>Προηγούμενες Παραγγελίες</h3>
            {orders.map((order) => (
                <div className="order-card" key={order._id}>
                    <div
                        className="order-header"
                        onClick={() => toggleOrder(order._id)}
                    >
                        <div>
                            <h3>{order.username || "Customer"}</h3>
                            <p>€{order.total_price}</p>
                        </div>

                        <span className="status">{order.status}</span>
                    </div>

                    {openOrderId === order._id && (
                        <div className="order-dropdown">
                            <p>
                                <strong>Τρόπος Πληρωμής:</strong>{" "}
                                {order.payment_method}
                            </p>
                            <p>
                                <strong>Διεύθυνση:</strong> {order.address}
                            </p>

                            <div className="order-items">
                                {order.items?.map((item) => (
                                    <div className="order-item" key={item._id}>
                                        <span>{item.product_name}</span>
                                        <span>x{item.quantity}</span>
                                        <span>{formatMoney(item.price)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
