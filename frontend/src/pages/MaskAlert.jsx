
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MaskAlert() {
    const navigate = useNavigate();

    useEffect(() => {
        const message = new SpeechSynthesisUtterance(
            "Please wear your mask."
        );

        message.rate = 0.9;
        message.pitch = 1;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(message);

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    return (
        <div className="mask-alert-page">

            {/* Background Effects */}
            <div className="mask-alert-glow mask-alert-glow-one"></div>
            <div className="mask-alert-glow mask-alert-glow-two"></div>

            {/* Navbar */}
            <nav className="mask-alert-navbar">

                <button
                    className="mask-alert-brand"
                    onClick={() => navigate("/")}
                >
                    <div className="mask-alert-brand-icon">
                        ✦
                    </div>

                    <div>
                        <span>SmartAttend</span>
                        <small>AI ATTENDANCE & SECURITY</small>
                    </div>
                </button>

                <div className="mask-alert-security-status">
                    <span></span>
                    Security Check
                </div>

            </nav>

            {/* Main Alert */}
            <main className="mask-alert-main">

                <div className="mask-alert-card">

                    {/* Warning Icon */}
                    <div className="mask-alert-icon-wrapper">
                        <div className="mask-alert-icon-ring"></div>

                        <div className="mask-alert-icon">
                            !
                        </div>
                    </div>

                    {/* Badge */}
                    <div className="mask-alert-badge">
                        <span></span>
                        MASK DETECTION ALERT
                    </div>

                    <h1>
                        Please Wear
                        <span> Your Mask</span>
                    </h1>

                    <p className="mask-alert-description">
                        Our AI security system could not detect
                        a face mask. Please wear your mask properly
                        and try the verification again.
                    </p>

                    {/* Detection Status */}
                    <div className="mask-alert-status">

                        <div className="mask-alert-status-icon">
                            !
                        </div>

                        <div className="mask-alert-status-content">
                            <strong>
                                Mask Not Detected
                            </strong>

                            <span>
                                Face protection is required
                                to continue.
                            </span>
                        </div>

                        <div className="mask-alert-status-dot">
                            <span></span>
                        </div>

                    </div>

                    {/* Try Again */}
                    <button
                        className="mask-alert-button"
                        onClick={() =>
                            navigate("/mask-verification")
                        }
                    >
                        <span>↻</span>
                        Try Again
                        <b>→</b>
                    </button>

                    <button
                        className="mask-alert-home-button"
                        onClick={() => navigate("/")}
                    >
                        Return to Home
                    </button>

                    {/* Security Note */}
                    <div className="mask-alert-security-note">

                        <div className="mask-alert-check">
                            ✓
                        </div>

                        <div>
                            <strong>
                                Security Verification
                            </strong>

                            <span>
                                Mask detection helps maintain
                                a secure attendance environment.
                            </span>
                        </div>

                    </div>

                </div>

                {/* Bottom Indicator */}
                <div className="mask-alert-footer-status">

                    <div>
                        <span className="status-green"></span>
                        Face Recognition
                    </div>

                    <div>
                        <span className="status-yellow"></span>
                        Mask Required
                    </div>

                    <div>
                        <span className="status-blue"></span>
                        Security Monitor
                    </div>

                </div>

            </main>

            <footer className="mask-alert-footer">
                <span>SmartAttend</span>
                <span>AI-Powered Attendance & Security</span>
                <span>© 2026</span>
            </footer>

        </div>
    );
}

export default MaskAlert;
