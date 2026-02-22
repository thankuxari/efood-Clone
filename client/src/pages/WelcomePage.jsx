import { Link } from "react-router-dom";
import "./welcomepage.css";

export default function WelcomePage() {
    return (
        <>
            <div className="welcome-page-container">
                <div className="left-container">
                    <img src="/welcomepage.png" alt="" />
                </div>
                <div className="right-container">
                    <h1>
                        Συνδέσου στον λογαριασμό σου και αναζήτησε καταστήματα
                        με φαγητό!
                    </h1>
                    <Link
                        to="/login"
                        className="primary-button homepage-button"
                    >
                        Συνδέσου τώρα
                    </Link>
                </div>
            </div>
        </>
    );
}
