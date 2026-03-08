import { enqueueSnackbar } from "notistack";

export default function DeleteButton({ id, products, setProducts }) {
    async function deleteProduct() {
        try {
            const response = await fetch(
                "http://localhost:8000/v1/api/shops/delete_product",
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ id }),
                },
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            setProducts(products.filter((p) => p._id !== id));
            enqueueSnackbar("Το προϊον διαγράφτηκε επιτυχώς!", {
                variant: "success",
            });
        } catch (err) {
            console.error(err.message);
            enqueueSnackbar(err.message, { variant: "error" });
        }
    }

    return <i className="fa-solid fa-trash fa-fw" onClick={deleteProduct}></i>;
}
