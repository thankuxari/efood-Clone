import { useContext } from "react";
import { userContext } from "../context/userContext";
import "./usersettings.css";
export default function UserSettings() {
    const { user } = useContext(userContext);

    return (
        <div className="user-settings-container">
            <h3>Ο λογαριασμός μου</h3>
            <form action="">
                <label htmlFor="username">Όνομα</label>
                <input type="text" id="username" placeholder={user?.username} />
                <label htmlFor="lastname">Επώνυμο</label>
                <input type="text" id="lastname" placeholder="" />
                <label htmlFor="address">Διεύθυνση</label>
                <input type="text" id="address" />
                <label htmlFor="phone">Κινητό</label>
                <input type="tel" max={1} id="phone" />
                <button className="primary-button">Αποθήκευση Αλλαγών</button>
            </form>
        </div>
    );
}
