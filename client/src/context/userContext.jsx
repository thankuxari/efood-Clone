import { createContext, useState, useEffect } from "react";

export const userContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getLoggedInUser() {
            setLoading(true);
            try {
                const response = await fetch(
                    "http://localhost:8000/v1/api/users/me",
                    {
                        credentials: "include",
                    },
                );

                if (!response.ok) {
                    setUser(null);
                    throw new Error(`HTTP Error : ${response.status}`);
                }

                const data = await response.json();
                setUser(data);
            } catch (err) {
                console.log(err.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        getLoggedInUser();
    }, []);

    return (
        <userContext.Provider value={{ user, setUser, loading }}>
            {!loading && children}
        </userContext.Provider>
    );
}
