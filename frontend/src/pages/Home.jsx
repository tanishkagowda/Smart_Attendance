import { useNavigate } from "react-router-dom";
import "./home.css";
function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-page">

            {/* Background Effects */}
            <div className="home-glow home-glow-one"></div>
            <div className="home-glow home-glow-two"></div>
            <div className="home-grid"></div>

            {/* Navigation */}
            <nav className="home-navbar">

                <div className="home-brand">
                    <div className="home-brand-icon">
                        ✦
                    </div>

                    <div>
                        <span>SmartAttend</span>
                        <small>
                            AI ATTENDANCE & SECURITY
                        </small>
                    </div>
                </div>

                <div className="home-nav-status">
                    <span></span>
                    System Online
                </div>

            </nav>

            {/* Main Hero */}
            <main className="home-main">

                <section className="home-hero">

                    {/* Left Content */}
                    <div className="home-content">

                        <div className="home-badge">
                            <span className="home-badge-dot"></span>

                            AI-POWERED ATTENDANCE SYSTEM
                        </div>

                        <h1>
                            Smart Attendance.
                            <br />

                            <span>
                                Smarter Security.
                            </span>
                        </h1>

                        <p className="home-description">
                            A modern attendance platform powered by
                            AI face recognition, mask detection,
                            and intelligent security monitoring.
                        </p>

                        {/* Action Buttons */}
                        <div className="home-actions">

                            <button
                                className="home-primary-btn"
                                onClick={() =>
                                    navigate(
                                        "/mark-attendance"
                                    )
                                }
                            >
                                <span className="home-btn-icon">
                                    ◉
                                </span>

                                Mark Attendance

                                <span className="home-btn-arrow">
                                    →
                                </span>
                            </button>

                            <button
                                className="home-secondary-btn"
                                onClick={() =>
                                    navigate(
                                        "/admin-login"
                                    )
                                }
                            >
                                <span>
                                    ◈
                                </span>

                                Admin Login
                            </button>

                        </div>

                        {/* Trust / Features */}
                        <div className="home-features">

                            <div className="home-feature">

                                <div className="home-feature-icon blue">
                                    ◉
                                </div>

                                <div>
                                    <strong>
                                        Face Recognition
                                    </strong>

                                    <span>
                                        AI-powered identity
                                        verification
                                    </span>
                                </div>

                            </div>

                            <div className="home-feature">

                                <div className="home-feature-icon purple">
                                    ◇
                                </div>

                                <div>
                                    <strong>
                                        Smart Security
                                    </strong>

                                    <span>
                                        Intelligent visitor
                                        monitoring
                                    </span>
                                </div>

                            </div>

                            <div className="home-feature">

                                <div className="home-feature-icon green">
                                    ✓
                                </div>

                                <div>
                                    <strong>
                                        Instant Records
                                    </strong>

                                    <span>
                                        Secure attendance
                                        tracking
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Right Visual */}
                    <div className="home-visual">

                        <div className="home-orbit orbit-one"></div>
                        <div className="home-orbit orbit-two"></div>
                        <div className="home-orbit orbit-three"></div>

                        <div className="home-ai-card">

                            <div className="home-ai-header">

                                <div className="home-ai-title">
                                    <div className="home-ai-icon">
                                        ✦
                                    </div>

                                    <div>
                                        <strong>
                                            AI Security
                                        </strong>

                                        <span>
                                            Live monitoring
                                        </span>
                                    </div>
                                </div>

                                <div className="home-live">
                                    <span></span>
                                    LIVE
                                </div>

                            </div>

                            {/* Face Scanner */}
                            <div className="home-face-scanner">

                                <div className="scanner-corner top-left"></div>
                                <div className="scanner-corner top-right"></div>
                                <div className="scanner-corner bottom-left"></div>
                                <div className="scanner-corner bottom-right"></div>

                                <div className="home-face-symbol">
                                    ◉
                                </div>

                                <div className="home-scan-line"></div>

                                <div className="home-recognition-label">
                                    <span></span>
                                    FACE RECOGNITION READY
                                </div>

                            </div>

                            {/* AI Status */}
                            <div className="home-ai-status">

                                <div>
                                    <span className="status-dot green"></span>
                                    Recognition Engine
                                </div>

                                <strong>
                                    READY
                                </strong>

                            </div>

                            <div className="home-ai-status">

                                <div>
                                    <span className="status-dot blue"></span>
                                    Mask Detection
                                </div>

                                <strong>
                                    ACTIVE
                                </strong>

                            </div>

                            <div className="home-ai-status">

                                <div>
                                    <span className="status-dot purple"></span>
                                    Security Monitor
                                </div>

                                <strong>
                                    ONLINE
                                </strong>

                            </div>

                        </div>

                        {/* Floating Security Card */}
                        <div className="home-floating-card">

                            <div className="floating-icon">
                                ✓
                            </div>

                            <div>
                                <span>
                                    SYSTEM STATUS
                                </span>

                                <strong>
                                    All Systems Secure
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>

                {/* Bottom Stats */}
                <section className="home-bottom-bar">

                    <div>
                        <strong>
                            AI
                        </strong>

                        <span>
                            Face Recognition
                        </span>
                    </div>

                    <div className="home-stat-divider"></div>

                    <div>
                        <strong>
                            24/7
                        </strong>

                        <span>
                            Security Monitoring
                        </span>
                    </div>

                    <div className="home-stat-divider"></div>

                    <div>
                        <strong>
                            100%
                        </strong>

                        <span>
                            Digital Records
                        </span>
                    </div>

                    <div className="home-stat-divider"></div>

                    <div>
                        <strong>
                            ⚡
                        </strong>

                        <span>
                            Instant Verification
                        </span>
                    </div>

                </section>

            </main>

            {/* Footer */}
            <footer className="home-footer">
                <span>
                    SmartAttend
                </span>

                <span>
                    AI-Powered Attendance & Security
                </span>

                <span>
                    © 2026
                </span>
            </footer>

        </div>
    );
}

export default Home;