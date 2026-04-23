import "./thankyoupage.css";

export default function ThankYouPage() {
    return (
        <div className="thank-you-container">
            <div className="thank-you-card">
                <div className="check-icon">✓</div>

                <h2>Η παραγγελία σου ολοκληρώθηκε!</h2>

                <p>
                    Σε ευχαριστούμε για την εμπιστοσύνη 🙌 <br />Η παραγγελία
                    σου θα βρίσκεται σύντομα στο σπίτι σου.
                </p>

                <div className="thank-you-actions">
                    <a href="/" className="btn primary">
                        Αρχική
                    </a>

                    <a href="/orders" className="btn secondary">
                        Οι παραγγελίες μου
                    </a>
                </div>
            </div>
        </div>
    );
}
