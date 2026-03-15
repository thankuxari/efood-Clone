import { useContext, useState } from "react";
import "./modal.css";
import { createPortal } from "react-dom";
import { modalContext } from "../context/modalContext";
import { enqueueSnackbar } from "notistack";
import usePreviewImage from "../hooks/usePreviewImage.js";

export default function Modal({ products, setProducts }) {
    const [form, setForm] = useState({
        product_name: "",
        price: "",
        product_description: "",
        product_image: "",
    });

    const { setOpenModal } = useContext(modalContext);

    const { handleImageChange, imageUrl } = usePreviewImage();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:8000/v1/api/shops/add_product",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ ...form, product_image: imageUrl }),
                },
            );

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const {
                product_name,
                price,
                shopId,
                product_description,
                product_image,
            } = await response.json();
            setOpenModal(false);
            setProducts([
                ...products,
                {
                    product_name,
                    price,
                    shopId,
                    product_description,
                    product_image,
                },
            ]);
            enqueueSnackbar("Ένα καινούργιο προϊον προσθέσηκε!", {
                variant: "success",
            });
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
                    <input
                        type="text"
                        name="product_description"
                        placeholder="Περιγραφή προϊόντος"
                        onChange={handleChange}
                    />
                    <label htmlFor="product_image">
                        Ανέβασε την εικόνα του προϊόντος
                    </label>
                    <input
                        type="file"
                        id="product_image"
                        onChange={handleImageChange}
                    />
                    {imageUrl && <img src={imageUrl} />}
                    <button type="submit" className="primary-button">
                        Προσθήκη
                    </button>
                </form>
            </div>
        </div>,
        document.getElementById("modal"),
    );
}
