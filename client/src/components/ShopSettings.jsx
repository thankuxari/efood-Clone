import { useState } from "react";
import { useContext } from "react";
import { shopContext } from "../context/shopContext.jsx";
import usePreviewImage from "../hooks/usePreviewImage.js";
import { enqueueSnackbar } from "notistack";
import "./shopsettings.css";

export default function ShopSettings() {
    const [openHours, setOpenHours] = useState("");
    const [closingHours, setClosingHours] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const { handleImageChange, imageUrl } = usePreviewImage();
    const { shop } = useContext(shopContext);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            console.log(openHours, closingHours);
            const response = await fetch(
                "http://localhost:8000/v1/api/shops/edit_shop",
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        openingHours: openHours || "",
                        closingHours: closingHours || "",
                        category: category || "",
                        shop_banner: imageUrl || "",
                    }),
                },
            );

            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            enqueueSnackbar("Οι αλλαγές ολοκληρώθηκαν", { variant: "success" });
            window.location.reload();
        } catch (err) {
            console.error(err.message);
            enqueueSnackbar("Κατι πήγε στραβά", { variant: "error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="settings-container">
            <div className="settings-view-header">
                <h2>Ρυθμίσεις καταστήματος</h2>
            </div>
            <div className="settings-grid">
                <form action="" onSubmit={handleSubmit}>
                    <div className="settings-view-container hours-container">
                        <h3>Ωράριο Καταστήματος</h3>
                        <div className="settings-hours-main">
                            <p>Τωρινό Ωράριο </p>
                            <p>Αλλαγή ωραρίου:</p>
                            <label htmlFor="open">Άνοιγμα: </label>
                            <input
                                type="time"
                                id="open"
                                onChange={(e) => setOpenHours(e.target.value)}
                            />
                            <label htmlFor="close">Κλείσιμο: </label>
                            <input
                                type="time"
                                id="close"
                                onChange={(e) =>
                                    setClosingHours(e.target.value)
                                }
                            />
                            <button type="submit">Αλλαγή</button>
                        </div>
                    </div>
                    <div className="settings-view-container description-container">
                        <h3>Περιγραφή καταστήματος</h3>
                        <p>
                            Επίλεξε μια απο τις παρακάτω κατηγορίες που
                            περιγράφουν το κατάστημα σου!
                        </p>
                        <select onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Επέλεξε κατηγορία</option>
                            <option value="Burgers">Burgers</option>
                            <option value="Γυράδικο">Γυράδικο</option>
                            <option value="Μαγειρευτά">Μαγειρευτά</option>
                            <option value="Ψάρια">Ψάρια</option>
                            <option value="Καφές">Καφές</option>
                            <option value="Κρέπες">Κρέπες</option>
                        </select>
                        <button type="submit">Αλλαγή</button>
                    </div>
                    <div className="settings-view-container banner-container">
                        <h3>Αλλαγή Φωτογραφίας Banner</h3>
                        <p>Άλλαξε το banner του μαγαζίου σου!</p>
                        <img
                            src={
                                imageUrl ||
                                shop?.shop_banner ||
                                "/shop_default_banner.jpg"
                            }
                            alt=""
                        />
                        <input type="file" onChange={handleImageChange} />
                        <button type="submit">Αλλαγή</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
