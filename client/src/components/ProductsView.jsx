import { useState, useEffect, useContext } from "react";
import { modalContext } from "../context/modalContext.jsx";
import formatMoney from "../utils/formatMoney.js";
import Modal from "./Modal.jsx";
import DeleteButton from "./DeleteButton.jsx";
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
                <h2>
                    {products.length}{" "}
                    {products.length === 1 ? "προϊόν" : "προϊόντα"}
                </h2>
                <button
                    className="primary-button"
                    onClick={() => setOpenModal(true)}
                >
                    Πρόσθεσε νέο προϊον
                </button>
            </div>
            <div className="products-grid">
                {products.map(
                    ({
                        _id,
                        product_name,
                        price,
                        product_image,
                        product_description,
                    }) => (
                        <div className="product-card" key={_id}>
                            <div className="product-information-container">
                                <h3>{product_name}</h3>
                                <h3 className="description">
                                    {product_description}
                                </h3>
                                <h4>{formatMoney(price)}</h4>
                            </div>

                            <div className="product-image-container">
                                <div className="product-actions-container">
                                    <DeleteButton
                                        id={_id}
                                        products={products}
                                        setProducts={setProducts}
                                    />
                                    <i className="fa-regular fa-pen-to-square fa-fw"></i>
                                </div>
                                {product_image && <img src={product_image} />}
                            </div>
                        </div>
                    ),
                )}
            </div>
            {openModal && (
                <Modal products={products} setProducts={setProducts} />
            )}
        </div>
    );
}
