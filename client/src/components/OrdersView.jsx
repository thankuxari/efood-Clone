import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import "./ordersview.css";

export default function OrdersView() {
    const [orders, setOrders] = useState([]);
    const [openOrderId, setOpenOrderId] = useState(null);

    useEffect(() => {
        async function getShopOrders() {
            try {
                const response = await fetch(
                    "http://localhost:8000/v1/api/shops/get_orders",
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message);
                }

                const data = await response.json();
                setOrders(data.orders);
            } catch (err) {
                console.error(err.message);
                enqueueSnackbar(err.message, { variant: "error" });
            }
        }
        getShopOrders();
    }, []);

    async function handleChangeOrderStatus(order_id) {
        try {
            const response = await fetch(
                "http://localhost:8000/v1/api/shops/update_order_status",
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        order_id,
                    }),
                },
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            enqueueSnackbar(`Η παραγγελία ολοκληρώθηκε ${order_id}`, {
                variant: "success",
            });

            setTimeout(() => {
                setOrders((prev) =>
                    prev.filter((order) => order._id !== order_id),
                );
            }, 600);
        } catch (err) {
            console.error(err.message);
            enqueueSnackbar(err.message, { variant: "error" });
        }
    }

    const toggleOrder = (id) => {
        setOpenOrderId(openOrderId === id ? null : id);
    };

    return (
        <div className="orders-container">
            <h2>Παραγγελίες</h2>

            <div className="orders-list">
                {orders.map((order) => (
                    <div className="order-card" key={order._id}>
                        <div
                            className="order-header"
                            onClick={() => toggleOrder(order._id)}
                        >
                            <div>
                                <h3>{order.customer_name || "Customer"}</h3>
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
                                        <div
                                            className="order-item"
                                            key={item._id}
                                        >
                                            <span>{item.product_name}</span>
                                            <span>x{item.quantity}</span>
                                            <span>{item.price}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() =>
                                        handleChangeOrderStatus(order._id)
                                    }
                                    className="primary-button"
                                >
                                    Ολοκλήρωση
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
