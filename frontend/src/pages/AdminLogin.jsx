import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminLogin() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post(
                "/auth/login/",
                {
                    username: username,
                    password: password,
                }
            );

            if (response.data.success) {
                navigate("/admin-dashboard");
            } else {
                setError(response.data.message);
            }

        } catch (error) {
            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Login failed."
                );
            } else {
                setError(
                    "Unable to connect to the server."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            {/* =========================================
                BACKGROUND DECORATION
            ========================================= */}

            <div className="login-glow login-glow-one"></div>
            <div className="login-glow login-glow-two"></div>


            {/* =========================================
                TOP BRAND
            ========================================= */}

            <div className="login-brand">

                <div className="login-brand-icon">
                    🛡️
                </div>

                <div>
                    <h2>SmartAttend</h2>
                    <span>
                        AI ATTENDANCE & SECURITY
                    </span>
                </div>

            </div>


            {/* =========================================
                LOGIN CONTAINER
            ========================================= */}

            <div className="login-layout">

                {/* LEFT INFORMATION */}

                <div className="login-intro">

                    <span className="login-badge">
                        ✦ SECURE ADMIN PORTAL
                    </span>

                    <h1>
                        Manage your
                        <span> attendance </span>
                        intelligently.
                    </h1>

                    <p>
                        Access your centralized attendance
                        management system, monitor visitors
                        and manage face recognition users
                        from one secure dashboard.
                    </p>


                    <div className="login-features">

                        <div className="login-feature">

                            <div className="feature-icon">
                                ◉
                            </div>

                            <div>
                                <strong>
                                    AI Face Recognition
                                </strong>

                                <span>
                                    Intelligent identity verification
                                </span>
                            </div>

                        </div>


                        <div className="login-feature">

                            <div className="feature-icon">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Smart Attendance
                                </strong>

                                <span>
                                    Fast and automated attendance tracking
                                </span>
                            </div>

                        </div>


                        <div className="login-feature">

                            <div className="feature-icon">
                                🛡
                            </div>

                            <div>
                                <strong>
                                    Security Monitoring
                                </strong>

                                <span>
                                    Detect and monitor unknown visitors
                                </span>
                            </div>

                        </div>

                    </div>

                </div>


                {/* LOGIN CARD */}

                <div className="login-card">

                    <div className="login-card-header">

                        <div className="login-lock-icon">
                            🔐
                        </div>

                        <div>
                            <h2>
                                Admin Login
                            </h2>

                            <p>
                                Sign in to continue
                            </p>
                        </div>

                    </div>


                    {/* SECURITY STATUS */}

                    <div className="login-security">

                        <span className="login-security-dot"></span>

                        Secure connection

                    </div>


                    <form onSubmit={handleLogin}>

                        {/* USERNAME */}

                        <div className="login-form-group">

                            <label>
                                Username
                            </label>

                            <div className="login-input-wrapper">

                                <span className="login-input-icon">
                                    ◉
                                </span>

                                <input
                                    type="text"
                                    value={username}
                                    onChange={(event) =>
                                        setUsername(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                    required
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="login-form-group">

                            <label>
                                Password
                            </label>

                            <div className="login-input-wrapper">

                                <span className="login-input-icon">
                                    🔑
                                </span>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                />

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (
                            <div className="login-error">

                                <span>
                                    ⚠
                                </span>

                                <p>
                                    {error}
                                </p>

                            </div>
                        )}


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="button-spinner"></span>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <span className="login-button-arrow">
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </form>


                    {/* FOOTER */}

                    <div className="login-card-footer">

                        <span className="footer-line"></span>

                        <span>
                            Authorized personnel only
                        </span>

                        <span className="footer-line"></span>

                    </div>

                </div>

            </div>


            {/* =========================================
                BOTTOM FOOTER
            ========================================= */}

            <div className="login-footer">

                <span>
                    © 2026 SmartAttend
                </span>

                <span className="footer-dot">
                    •
                </span>

                <span>
                    AI-Powered Attendance & Security
                </span>

            </div>

        </div>
    );
}

export default AdminLogin;