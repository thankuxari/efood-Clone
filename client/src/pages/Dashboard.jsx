import { useContext, useState } from "react";
import { shopContext } from "../context/shopContext";
import ProductsView from "../components/ProductsView.jsx";
import OrdersView from "../components/OrdersView.jsx";
import ReviewsView from "../components/ReviewsView.jsx";
import ShopSettings from "../components/ShopSettings.jsx";
import "./dashboard.css";

export default function Dashboard() {
    const [currentTab, setCurrentTab] = useState("products");
    const { shop } = useContext(shopContext);

    return (
        <div className="dashboard-container">
            <h1 className="welcome-title">
                Καλωσόρισες πίσω <span>{shop.shop_name}</span>
            </h1>
            <div className="dashboard-main">
                <div className="sidebar-container">
                    <ul name="" id="">
                        <li
                            value="products"
                            onClick={() => setCurrentTab("products")}
                        >
                            <span>Προϊόντα</span>
                        </li>
                        <li
                            value="orders"
                            onClick={() => setCurrentTab("orders")}
                        >
                            <span>Παραγγελίες</span>
                        </li>
                        <li
                            value="reviews"
                            onClick={() => setCurrentTab("reviews")}
                        >
                            <span>Κριτικές</span>
                        </li>
                        <li
                            value="reviews"
                            onClick={() => setCurrentTab("settings")}
                        >
                            <span>Πληροφορίες/Ρυθμίσεις Καταστήματος</span>
                        </li>
                    </ul>
                </div>
                <div className="view-container">
                    {currentTab === "products" && <ProductsView />}
                    {currentTab === "orders" && <OrdersView />}
                    {currentTab === "reviews" && <ReviewsView />}
                    {currentTab === "settings" && <ShopSettings />}
                </div>
            </div>
        </div>
    );
}
