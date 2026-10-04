
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./adminDashboard.css";
function RegisterUser() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        user_id: "",
        name: "",
        email: "",
        department: "",
        phone: "",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await api.post(
                "/users/register/",
                formData
            );

            if (response.data.success) {
                const registeredUserId =
                    response.data.user.id;

                navigate(
                    `/face-capture/${registeredUserId}`
                );
            }
        } catch (error) {
            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Registration failed."
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
        <div className="register-page">

            {/* Background Effects */}
            <div className="register-glow register-glow-one"></div>
            <div className="register-glow register-glow-two"></div>
            <div className="register-grid"></div>

            {/* Navbar */}
            <nav className="register-navbar">

                <button
                    className="register-brand"
                    onClick={() =>
                        navigate("/admin-dashboard")
                    }
                >
                    <div className="register-brand-icon">
                        ✦
                    </div>

                    <div>
                        <span>SmartAttend</span>
                        <small>
                            AI ATTENDANCE & SECURITY
                        </small>
                    </div>
                </button>

                <button
                    className="register-back-btn"
                    onClick={() =>
                        navigate("/admin-dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </nav>

            <main className="register-main">

                {/* Heading */}
                <div className="register-heading">

                    <div className="register-badge">
                        <span></span>
                        USER MANAGEMENT
                    </div>

                    <h1>
                        Register a <span>New User</span>
                    </h1>

                    <p>
                        Add a user to the attendance system
                        and continue to secure face registration.
                    </p>

                </div>

                {/* Main Content */}
                <div className="register-layout">

                    {/* Form Card */}
                    <section className="register-card">

                        <div className="register-card-header">

                            <div className="register-card-icon">
                                +
                            </div>

                            <div>
                                <h2>User Information</h2>
                                <p>
                                    Enter the user's details
                                    below
                                </p>
                            </div>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="register-form"
                        >

                            {/* User ID */}
                            <div className="register-form-group">

                                <label htmlFor="user_id">
                                    User ID
                                    <span>*</span>
                                </label>

                                <div className="register-input-wrapper">
                                    <span>▣</span>

                                    <input
                                        id="user_id"
                                        type="text"
                                        name="user_id"
                                        value={formData.user_id}
                                        onChange={handleChange}
                                        placeholder="Enter unique user ID"
                                        required
                                    />
                                </div>

                                <small>
                                    Unique identifier for this user
                                </small>

                            </div>

                            {/* Name */}
                            <div className="register-form-group">

                                <label htmlFor="name">
                                    Full Name
                                    <span>*</span>
                                </label>

                                <div className="register-input-wrapper">
                                    <span>◎</span>

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>

                            </div>

                            {/* Email + Phone */}
                            <div className="register-form-row">

                                <div className="register-form-group">

                                    <label htmlFor="email">
                                        Email Address
                                    </label>

                                    <div className="register-input-wrapper">
                                        <span>@</span>

                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="name@example.com"
                                        />
                                    </div>

                                </div>

                                <div className="register-form-group">

                                    <label htmlFor="phone">
                                        Phone Number
                                    </label>

                                    <div className="register-input-wrapper">
                                        <span>⌕</span>

                                        <input
                                            id="phone"
                                            type="text"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                        />
                                    </div>

                                </div>

                            </div>

                            {/* Department */}
                            <div className="register-form-group">

                                <label htmlFor="department">
                                    Department
                                </label>

                                <div className="register-input-wrapper">
                                    <span>◇</span>

                                    <input
                                        id="department"
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder="e.g. Computer Science"
                                    />
                                </div>

                            </div>

                            {/* Messages */}
                            {error && (
                                <div className="register-message error">
                                    <div>!</div>
                                    <span>{error}</span>
                                </div>
                            )}

                            {message && !error && (
                                <div className="register-message success">
                                    <div>✓</div>
                                    <span>{message}</span>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                className="register-submit-btn"
                                disabled={loading}
                            >
                                <span>
                                    {loading ? "◌" : "✦"}
                                </span>

                                {loading
                                    ? "Registering User..."
                                    : "Register User"}

                                {!loading && (
                                    <b>→</b>
                                )}
                            </button>

                        </form>

                    </section>

                    {/* Side Information */}
                    <aside className="register-side">

                        {/* Registration Process */}
                        <div className="register-info-card">

                            <div className="register-info-header">

                                <div className="register-info-icon">
                                    ✦
                                </div>

                                <div>
                                    <h3>
                                        Registration Process
                                    </h3>

                                    <span>
                                        Two-step secure setup
                                    </span>
                                </div>

                            </div>

                            <div className="register-process">

                                <div className="register-process-item active">

                                    <div className="process-number">
                                        01
                                    </div>

                                    <div>
                                        <strong>
                                            User Details
                                        </strong>

                                        <span>
                                            Enter basic information
                                        </span>
                                    </div>

                                </div>

                                <div className="process-line"></div>

                                <div className="register-process-item">

                                    <div className="process-number">
                                        02
                                    </div>

                                    <div>
                                        <strong>
                                            Face Registration
                                        </strong>

                                        <span>
                                            Capture face images
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* AI Card */}
                        <div className="register-ai-card">

                            <div className="register-ai-orbit">
                                ✦
                            </div>

                            <div className="register-ai-content">

                                <div className="register-ai-status">
                                    <span></span>
                                    AI SYSTEM READY
                                </div>

                                <h3>
                                    Secure Face
                                    <br />
                                    Recognition
                                </h3>

                                <p>
                                    After registration, you'll
                                    capture multiple face images
                                    to create the user's secure
                                    recognition profile.
                                </p>

                            </div>

                        </div>

                        {/* Security Note */}
                        <div className="register-security">

                            <div className="register-security-icon">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Secure Registration
                                </strong>

                                <span>
                                    User information is stored
                                    securely in the attendance
                                    system.
                                </span>
                            </div>

                        </div>

                    </aside>

                </div>

            </main>

            <footer className="register-footer">
                <span>SmartAttend</span>
                <span>
                    AI-Powered Attendance & Security
                </span>
                <span>© 2026</span>
            </footer>

        </div>
    );
}

export default RegisterUser;
