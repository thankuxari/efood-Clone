import "./shopsettings.css";

export default function ShopSettings() {
    return (
        <div className="settings-container">
            <div className="settings-view-header">
                <h2>Ρυθμίσεις καταστήματος</h2>
            </div>
            <div className="settings-grid">
                <div className="settings-view-container hours-container">
                    <h3>Ωράριο Καταστήματος</h3>
                    <div className="settings-hours-main">
                        <p>Τωρινό Ωράριο</p>
                        <p>Αλλαγή ωραρίου:</p>
                        <label htmlFor="open">Άνοιγμα: </label>
                        <input type="time" id="open" />
                        <label htmlFor="close">Κλείσιμο: </label>
                        <input type="time" id="close" />
                        <button>Αλλαγή</button>
                    </div>
                </div>
                <div className="settings-view-container description-container">
                    <h3>Περιγραφή καταστήματος</h3>
                    <p>
                        Επίλεξε μια απο τις παρακάτω κατηγορίες που περιγράφουν
                        το κατάστημα σου!
                    </p>
                    <select name="" id="">
                        <option value="burger">Burgers</option>
                        <option value="gyro">Γυράδικο</option>
                        <option value="homemade">Μαγειρευτά</option>
                        <option value="fish">Ψάρια</option>
                        <option value="coffee">Καφές</option>
                        <option value="crepes">Κρέπες</option>
                    </select>
                </div>
                <div className="settings-view-container banner-container">
                    <h3>Αλλαγή Φωτογραφίας Banner</h3>
                    <p>Άλλαξε το banner του μαγαζίου σου!</p>
                    <input type="file" />
                </div>
            </div>
        </div>
    );
}
