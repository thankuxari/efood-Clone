import { useState, useEffect, useContext } from "react";
import { modalContext } from "../context/modalContext.jsx";
import formatMoney from "../utils/formatMoney.js";
import Modal from "./Modal.jsx";
import "./productsview.css";

export default function ProductsView() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const { openModal, setOpenModal } = useContext(modalContext);

    useEffect(() => {
        async function getLoggedInShopProducts() {
            setLoading(true);
            try {
                const response = await fetch(
                    "http://localhost:8000/v1/api/shops/shop_products",
                    {
                        credentials: "include",
                    },
                );

                if (!response.ok)
                    throw new Error(`HTTP Error: ${response.status}`);

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error(err.messagae);
            } finally {
                setLoading(false);
            }
        }
        getLoggedInShopProducts();
    }, []);

    if (loading) return <h1>Φορτώνει...</h1>;
    if (products.length === 0)
        return (
            <>
                <div className="products-view-header">
                    <h2>Δεν βρέθηκαν προϊόντα</h2>
                    <button
                        className="primary-button"
                        onClick={() => setOpenModal(true)}
                    >
                        Πρόσθεσε νέο προϊον
                    </button>
                </div>
                {openModal && (
                    <Modal products={products} setProducts={setProducts} />
                )}
            </>
        );

    console.log(products);

    return (
        <div className="products-view-container">
            <div className="products-view-header">
                <h2>{products.length} προϊόντα</h2>
                <button
                    className="primary-button"
                    onClick={() => setOpenModal(true)}
                >
                    Πρόσθεσε νέο προϊον
                </button>
            </div>
            <div className="products-grid">
                {products.map(({ _id, product_name, price }) => (
                    <div className="product-card" key={_id}>
                        <img src="https://placehold.co/150x100" alt="" />
                        <div className="product-information-container">
                            <h4>{product_name}</h4>
                            <span>{formatMoney(price)}</span>
                        </div>
                    </div>
                ))}
            </div>
            {openModal && (
                <Modal products={products} setProducts={setProducts} />
            )}
        </div>
    );
}
