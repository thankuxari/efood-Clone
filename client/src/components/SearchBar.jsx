import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./searchbar.css";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [searchQueryResult, setSearchQueryResult] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const searchRef = useRef(null);

    useEffect(() => {
        async function getSearchQueryResult() {
            try {
                const response = await fetch(
                    "http://localhost:8000/v1/api/users/search",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ query }),
                    },
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message);
                }
                const data = await response.json();
                setSearchQueryResult(data.result);
            } catch (err) {
                console.log(err.message);
            }
        }

        if (query.length >= 2) {
            getSearchQueryResult();
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [query]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function handleChange(e) {
        setQuery(e.target.value);
    }

    return (
        <form className="search-bar" ref={searchRef}>
            <input
                className="search-bar-input"
                type="search"
                value={query}
                placeholder="Αναζήτηση"
                onChange={handleChange}
                onFocus={() => query.length >= 2 && setIsOpen(true)}
            />

            {isOpen && (
                <div className="search-bar-dropdown-result">
                    <h4>Προτάσεις</h4>
                    {searchQueryResult.map((result) => (
                        <Link
                            to={`/shops/${result._id}`}
                            className="search-result-container"
                            key={result.id}
                            onClick={() => {
                                setIsOpen(false);
                                setQuery("");
                            }}
                        >
                            {result?.shop_logo && (
                                <img src={result.shop_logo} alt="" />
                            )}
                            <h5>{result.shop_name}</h5>
                        </Link>
                    ))}
                </div>
            )}
        </form>
    );
}
