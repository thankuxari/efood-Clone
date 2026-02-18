import { createContext, useState, useEffect } from "react";

export const shopContext = createContext();

export function ShopProvider({ children }) {
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getLoggedInShop() {
            setLoading(true);
            try {
                const response = await fetch(
                    "http://localhost:8000/api/v1/shops/me",
                    {
                        credentials: "include",
                    },
                );

                if (!response.ok)
                    throw new Error(`HTTP Error ${response.status}`);

                const data = await response.json();
                setShop(data);
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        }
        getLoggedInShop();
    }, []);

    return (
        <shopContext.Provider value={{ shop, setShop }}>
            {children}
        </shopContext.Provider>
    );
}
