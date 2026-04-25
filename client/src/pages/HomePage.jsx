import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./homepage.css";

export default function HomePage() {
    const [shops, setShops] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getShops() {
            setLoading(true);
            try {
                const response = await fetch(
                    "http://localhost:8000/v1/api/shops/",
                );

                if (!response.ok)
                    throw new Error(`HTTP Error: ${response.status}`);

                const data = await response.json();
                setShops(data);
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }
        getShops();

        async function filterShopsOnCategory() {
            try {
                const response = await fetch(
                    `http://localhost:8000/v1/api/shops/category?category=${categories}`,
                );

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error);
                }

                const data = await response.json();
                console.log(data);
                setShops(data);
            } catch (err) {
                console.error(err.message);
            }
        }

        filterShopsOnCategory();
    }, [categories]);

    function handleCategoryChange(e) {
        const { value, checked } = e.target;
        setCategories((prev) =>
            checked ? [...prev, value] : prev.filter((p) => p !== value),
        );
    }

    if (loading) return <h1>Loading...</h1>;

    console.log(categories);
    return (
        <div className="homepage-container">
            <h1>
                {shops.length}{" "}
                {shops.length === 1 ? "Κατάστημα" : "Καταστήματα"}
            </h1>
            <div className="homepage-main-container">
                <div className="left-home-container">
                    <div className="categories-container">
                        <div className="category-item">
                            <input
                                type="checkbox"
                                id="coffee"
                                value="Καφές"
                                checked={categories.includes("Καφές")}
                                onChange={(e) => handleCategoryChange(e)}
                            />
                            <label htmlFor="coffee">Καφές</label>
                        </div>
                        <div className="category-item">
                            <input
                                type="checkbox"
                                id="gyros"
                                value="Γύρος"
                                checked={categories.includes("Γύρος")}
                                onChange={(e) => handleCategoryChange(e)}
                            />
                            <label htmlFor="gyros">Γύρος</label>
                        </div>
                        <div className="category-item">
                            <input
                                type="checkbox"
                                id="burger"
                                value="Burgers"
                                checked={categories.includes("Burgers")}
                                onChange={(e) => handleCategoryChange(e)}
                            />
                            <label htmlFor="burger">Burgers</label>
                        </div>
                        <div className="category-item">
                            <input
                                type="checkbox"
                                id="cooked"
                                value="Μαγειρευτά"
                                checked={categories.includes("Μαγειρευτά")}
                                onChange={(e) => handleCategoryChange(e)}
                            />
                            <label htmlFor="cooked">Μαγειρευτά</label>
                        </div>
                        <div className="category-item">
                            <input
                                type="checkbox"
                                id="fish"
                                value="Ψάρια"
                                checked={categories.includes("Ψάρια")}
                                onChange={(e) => handleCategoryChange(e)}
                            />
                            <label htmlFor="fish">Ψάρια</label>
                        </div>
                        <div className="category-item">
                            <input
                                type="checkbox"
                                id="crepes"
                                value="Κρέπες"
                                checked={categories.includes("Κρέπες")}
                                onChange={(e) => handleCategoryChange(e)}
                            />
                            <label htmlFor="crepes">Κρέπες</label>
                        </div>
                    </div>
                    <div className="category-labels-container">
                        {categories.map((category) => (
                            <div
                                className="category-label"
                                onClick={() =>
                                    setCategories((prev) =>
                                        prev.filter((p) => p !== category),
                                    )
                                }
                            >
                                <h5>{category}</h5>
                                <i className="fa-solid fa-x"></i>{" "}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="rigth-home-container">
                    <div className="shop-grid">
                        {shops.map(
                            ({
                                _id,
                                shop_name,
                                shop_category,
                                shop_logo,
                                shop_banner,
                                shop_opening_hours,
                                shop_closing_hours,
                            }) => (
                                <Link
                                    key={_id}
                                    to={`shops/${_id}`}
                                    className="shop-card"
                                >
                                    <div className="top-container">
                                        <img
                                            src={
                                                !shop_banner
                                                    ? "/shop_default_banner.jpg"
                                                    : shop_banner
                                            }
                                            alt=""
                                        />
                                        <img
                                            className="shop-logo"
                                            src={
                                                !shop_logo
                                                    ? "/shop_default_profile.jpg"
                                                    : shop_logo
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <div className="bottom-container">
                                        <h5>{shop_name}</h5>
                                        <span>
                                            {!shop_category
                                                ? "Κατάστημα"
                                                : shop_category}
                                        </span>
                                        <span>
                                            {!shop_opening_hours ||
                                            !shop_closing_hours ? (
                                                ""
                                            ) : (
                                                <span>
                                                    {shop_opening_hours} -{" "}
                                                    {shop_closing_hours}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </Link>
                            ),
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
