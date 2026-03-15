import { createContext, useState, useEffect, useContext } from "react";
import { userContext } from "./userContext.jsx";

export const cartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(userContext);

    async function getUsersCart() {
        try {
            const response = await fetch(
                "http://localhost:8000/v1/api/users/get_cart",
                {
                    credentials: "include",
                    method: "GET",
                },
            );

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

            const data = await response.json();
            setCart(data);
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            getUsersCart();
        } else {
            setLoading(false);
        }
    }, [user]);

    async function addToCart(product) {
        try {
            const response = await fetch(
                "http://localhost:8000/v1/api/users/add_cart",
                {
                    credentials: "include",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: product._id }),
                },
            );

            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

            setCart((prev) => {
                const existing = prev.find((p) => p.product_id === product._id);
                if (existing) {
                    return prev.map((p) =>
                        p.product_id === product._id
                            ? { ...p, quantity: p.quantity + 1 }
                            : p,
                    );
                }

                return [...prev, { ...product, quantity: 1 }];
            });
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <cartContext.Provider value={{ cart, setCart, addToCart, loading }}>
            {children}
        </cartContext.Provider>
    );
}
