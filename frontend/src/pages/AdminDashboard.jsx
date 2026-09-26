import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        registered_users: 0,
        today_attendance: 0,
        unknown_visitors: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await api.get("/dashboard/stats/");

            if (response.data.success) {
                setStats({
                    registered_users:
                        response.data.registered_users,

                    today_attendance:
                        response.data.today_attendance,

                    unknown_visitors:
                        response.data.unknown_visitors,
                });
            }
        } catch (error) {
            console.error(error);
            setError("Unable to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>

                <h2>Loading Dashboard</h2>

                <p>
                    Preparing your attendance overview...
                </p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">

            {/* =========================================
                SIDEBAR
            ========================================= */}

            <aside className="dashboard-sidebar">

                <div className="sidebar-brand">

                    <div className="brand-icon">
                        🛡️
                    </div>

                    <div>
                        <h2>SmartAttend</h2>
                        <span>AI Attendance System</span>
                    </div>

                </div>

                <div className="sidebar-section">

                    <p className="sidebar-title">
                        MAIN MENU
                    </p>

                    <button
                        className="sidebar-item active"
                        onClick={() =>
                            navigate("/admin-dashboard")
                        }
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        className="sidebar-item"
                        onClick={() =>
                            navigate("/attendance-records")
                        }
                    >
                        <span>◷</span>
                        Attendance
                    </button>

                    <button
                        className="sidebar-item"
                        onClick={() =>
                            navigate("/register-user")
                        }
                    >
                        <span>♙</span>
                        Regester new users
                    </button>

                    <button
                        className="sidebar-item"
                        onClick={() =>
                            navigate("/unknown-visitors")
                        }
                    >
                        <span>⚠</span>
                        Unknown Visitors
                    </button>

                </div>

                <div className="sidebar-section">

                    <p className="sidebar-title">
                        SYSTEM
                    </p>

                    <button
                        className="sidebar-item"
                        onClick={() =>
                            navigate("/mark-attendance")
                        }
                    >
                        <span>◎</span>
                        Mark Attendance
                    </button>

                </div>

                <div className="sidebar-bottom">

                    <div className="system-status">

                        <span className="status-dot"></span>

                        <div>
                            <strong>System Online</strong>
                            <small>
                                All services operational
                            </small>
                        </div>

                    </div>

                </div>

            </aside>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <main className="dashboard-main">

                {/* TOP BAR */}

                <header className="dashboard-topbar">

                    <div>
                        <p className="topbar-label">
                            ADMINISTRATION
                        </p>

                        <h1>
                            Dashboard
                        </h1>
                    </div>

                    <div className="admin-profile">

                        <div className="admin-avatar">
                            A
                        </div>

                        <div>
                            <strong>Administrator</strong>

                            <span>
                                System Admin
                            </span>
                        </div>

                    </div>

                </header>


                {/* WELCOME */}

                <section className="welcome-card">

                    <div className="welcome-content">

                        <span className="welcome-badge">
                            ✦ AI POWERED
                        </span>

                        <h2>
                            Welcome to SmartAttend
                        </h2>

                        <p>
                            Monitor attendance, manage registered
                            users and keep track of unknown visitors
                            from one centralized dashboard.
                        </p>

                    </div>

                    <div className="welcome-visual">

                        <div className="orbit orbit-one"></div>
                        <div className="orbit orbit-two"></div>

                        <div className="shield-large">
                            🛡️
                        </div>

                    </div>

                </section>


                {/* ERROR */}

                {error && (
                    <div className="dashboard-error">
                        <span>⚠</span>
                        {error}
                    </div>
                )}


                {/* STATISTICS */}

                <section className="dashboard-section">

                    <div className="section-heading">

                        <div>
                            <p className="section-eyebrow">
                                OVERVIEW
                            </p>

                            <h2>
                                Today's Overview
                            </h2>
                        </div>

                        <span className="live-indicator">
                            <span></span>
                            LIVE
                        </span>

                    </div>


                    <div className="dashboard-stats">

                        {/* REGISTERED USERS */}

                        <div className="dashboard-stat-card blue">

                            <div className="stat-top">

                                <div className="dashboard-stat-icon">
                                    👥
                                </div>

                                <span className="stat-arrow">
                                    ↗
                                </span>

                            </div>

                            <p>
                                Registered Users
                            </p>

                            <h3>
                                {stats.registered_users}
                            </h3>

                            <span className="stat-description">
                                Active users in system
                            </span>

                        </div>


                        {/* ATTENDANCE */}

                        <div className="dashboard-stat-card green">

                            <div className="stat-top">

                                <div className="dashboard-stat-icon">
                                    ✓
                                </div>

                                <span className="stat-arrow">
                                    ↗
                                </span>

                            </div>

                            <p>
                                Today's Attendance
                            </p>

                            <h3>
                                {stats.today_attendance}
                            </h3>

                            <span className="stat-description">
                                Attendance marked today
                            </span>

                        </div>


                        {/* UNKNOWN VISITORS */}

                        <div className="dashboard-stat-card orange">

                            <div className="stat-top">

                                <div className="dashboard-stat-icon">
                                    ⚠
                                </div>

                                <span className="stat-arrow">
                                    ↗
                                </span>

                            </div>

                            <p>
                                Unknown Visitors
                            </p>

                            <h3>
                                {stats.unknown_visitors}
                            </h3>

                            <span className="stat-description">
                                Visitors detected today
                            </span>

                        </div>

                    </div>

                </section>


                {/* QUICK ACTIONS */}

                <section className="dashboard-section">

                    <div className="section-heading">

                        <div>
                            <p className="section-eyebrow">
                                MANAGEMENT
                            </p>

                            <h2>
                                Quick Actions
                            </h2>
                        </div>

                    </div>


                    <div className="quick-actions">

                        {/* REGISTER */}

                        <button
                            className="action-card"
                            onClick={() =>
                                navigate("/register-user")
                            }
                        >

                            <div className="action-icon blue-icon">
                                +
                            </div>

                            <div className="action-content">

                                <h3>
                                    Register New User
                                </h3>

                                <p>
                                    Add a new person and
                                    register their face.
                                </p>

                            </div>

                            <span className="action-arrow">
                                →
                            </span>

                        </button>


                        {/* ATTENDANCE */}

                        <button
                            className="action-card"
                            onClick={() =>
                                navigate("/attendance-records")
                            }
                        >

                            <div className="action-icon green-icon">
                                ◷
                            </div>

                            <div className="action-content">

                                <h3>
                                    View Attendance
                                </h3>

                                <p>
                                    View and filter attendance
                                    records.
                                </p>

                            </div>

                            <span className="action-arrow">
                                →
                            </span>

                        </button>


                        {/* UNKNOWN VISITORS */}

                        <button
                            className="action-card"
                            onClick={() =>
                                navigate("/unknown-visitors")
                            }
                        >

                            <div className="action-icon orange-icon">
                                ⚠
                            </div>

                            <div className="action-content">

                                <h3>
                                    Unknown Visitors
                                </h3>

                                <p>
                                    Review visitors who were
                                    not recognized.
                                </p>

                            </div>

                            <span className="action-arrow">
                                →
                            </span>

                        </button>

                    </div>

                </section>


                {/* SECURITY STATUS */}

                <section className="security-card">

                    <div className="security-left">

                        <div className="security-icon">
                            🛡️
                        </div>

                        <div>

                            <p>
                                SECURITY STATUS
                            </p>

                            <h3>
                                Smart Recognition Active
                            </h3>

                            <span>
                                Face recognition and security
                                monitoring services are ready.
                            </span>

                        </div>

                    </div>

                    <div className="security-status">

                        <span className="security-dot"></span>

                        Operational

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;