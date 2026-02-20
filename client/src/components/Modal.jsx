import { useContext, useState } from "react";
import "./modal.css";
import { createPortal } from "react-dom";
import { modalContext } from "../context/modalContext";

export default function Modal({ products, setProducts }) {
    const [form, setForm] = useState({
        product_name: "",
        price: "",
    });
    const { setOpenModal } = useContext(modalContext);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:8000/v1/api/shops/add_product",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(form),
                },
            );

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const { product_name, price } = await response.json();
            setOpenModal(false);
            setProducts([...products, { product_name, price }]);
        } catch (err) {
            console.error(err.message);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    return createPortal(
        <div className="overlay" onClick={() => setOpenModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Προσθήκη νέου προϊον</h3>
                <form action="submit" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="product_name"
                        placeholder="Όνομα προϊόντος"
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Τιμή προϊόντος"
                        onChange={handleChange}
                    />
                    <button type="submit">Προσθήκη</button>
                </form>
            </div>
        </div>,
        document.getElementById("modal"),
    );
}
