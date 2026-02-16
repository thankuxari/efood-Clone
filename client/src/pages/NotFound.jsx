import "./notfound.css";

export default function NotFound() {
    return (
        <>
            <div className="not-found-container">
                <div className="left-container">
                    <img src="/public/notfound.gif" alt="" />
                </div>
                <div className="right-container">
                    <h1>
                        <span>Σφάλμα</span>: Η σελίδα που αναζήτησες δεν
                        υπάρχει!
                    </h1>
                    <h5>
                        Η ιστοσελίδα δεν μπορεί να βρεί αυτό που έψαξες,
                        προσπάθησε ξανά.
                    </h5>
                </div>
            </div>
        </>
    );
}
