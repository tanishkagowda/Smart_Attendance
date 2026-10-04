
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./unknownVisitors.css";
function UnknownVisitors() {
    const navigate = useNavigate();

    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        try {
            const response = await api.get("/unknown-visitors/");

            if (response.data.success) {
                setVisitors(response.data.visitors);
            } else {
                setError("Failed to load unknown visitors.");
            }
        } catch (err) {
            console.error("Error loading visitors:", err);
            setError("Unable to load unknown visitor records.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="visitors-page">

            {/* Background */}
            <div className="visitors-glow visitors-glow-one"></div>
            <div className="visitors-glow visitors-glow-two"></div>

            {/* Sidebar */}
            <aside className="visitors-sidebar">

                <div className="visitors-brand">
                    <div className="visitors-brand-icon">
                        ✦
                    </div>

                    <div>
                        <strong>SmartAttend</strong>
                        <span>ADMIN CONSOLE</span>
                    </div>
                </div>

                <div className="visitors-sidebar-section">
                    <span>MAIN MENU</span>

                    <button
                        onClick={() =>
                            navigate("/admin-dashboard")
                        }
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        onClick={() =>
                            navigate("/attendance-records")
                        }
                    >
                        <span>◷</span>
                        Attendance
                    </button>

                    <button
                        onClick={() =>
                            navigate("/register-user")
                        }
                    >
                        <span>♙</span>
                        Users
                    </button>

                    <button className="active">
                        <span>◉</span>
                        Unknown Visitors
                    </button>
                </div>

                <div className="visitors-sidebar-section">
                    <span>ATTENDANCE</span>

                    <button
                        onClick={() =>
                            navigate("/mark-attendance")
                        }
                    >
                        <span>✦</span>
                        Mark Attendance
                    </button>
                </div>

                <div className="visitors-sidebar-bottom">

                    <div className="visitors-system-status">
                        <span></span>

                        <div>
                            <strong>System Online</strong>
                            <small>All services operational</small>
                        </div>
                    </div>

                    <button
                        className="visitors-home-btn"
                        onClick={() => navigate("/")}
                    >
                        ← Back to Home
                    </button>

                </div>

            </aside>

            {/* Main Content */}
            <main className="visitors-main">

                {/* Topbar */}
                <header className="visitors-topbar">

                    <div>
                        <span className="visitors-breadcrumb">
                            Admin / Security
                        </span>

                        <h1>Unknown Visitors</h1>
                    </div>

                    <div className="visitors-admin-profile">
                        <div className="visitors-admin-avatar">
                            A
                        </div>

                        <div>
                            <strong>Administrator</strong>
                            <span>Security Manager</span>
                        </div>
                    </div>

                </header>

                {/* Intro */}
                <section className="visitors-intro">

                    <div>
                        <div className="visitors-title-badge">
                            <span></span>
                            SECURITY MONITORING
                        </div>

                        <h2>
                            Unknown Visitor
                            <span> Records</span>
                        </h2>

                        <p>
                            Review faces that were not recognized
                            by the attendance system.
                        </p>
                    </div>

                    <div className="visitors-count-card">

                        <div className="visitors-count-icon">
                            ◉
                        </div>

                        <div>
                            <span>TOTAL VISITORS</span>
                            <strong>
                                {visitors.length}
                            </strong>
                        </div>

                    </div>

                </section>

                {/* Loading */}
                {loading && (
                    <div className="visitors-state-card">

                        <div className="visitors-loader"></div>

                        <h3>
                            Loading visitor records
                        </h3>

                        <p>
                            Fetching security records...
                        </p>

                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="visitors-error-card">

                        <div className="visitors-error-icon">
                            !
                        </div>

                        <div>
                            <strong>
                                Unable to load records
                            </strong>

                            <p>
                                {error}
                            </p>
                        </div>

                        <button onClick={fetchVisitors}>
                            Try Again
                        </button>

                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    !error &&
                    visitors.length === 0 && (
                        <div className="visitors-state-card">

                            <div className="visitors-empty-icon">
                                ✓
                            </div>

                            <h3>
                                No Unknown Visitors
                            </h3>

                            <p>
                                All recorded visitors have been
                                successfully recognized.
                            </p>

                        </div>
                    )}

                {/* Visitor Records */}
                {!loading &&
                    !error &&
                    visitors.length > 0 && (

                        <section className="visitor-records-section">

                            <div className="visitor-records-header">

                                <div>
                                    <h3>
                                        Security Records
                                    </h3>

                                    <p>
                                        Captured unknown visitor
                                        activity
                                    </p>
                                </div>

                                <div className="visitor-records-live">
                                    <span></span>
                                    RECORDS ACTIVE
                                </div>

                            </div>

                            <div className="visitor-grid">

                                {visitors.map((visitor) => (

                                    <article
                                        className="visitor-card"
                                        key={visitor.id}
                                    >

                                        <div className="visitor-image-wrapper">

                                            <img
                                                src={`http://127.0.0.1:8000${visitor.image}`}
                                                alt="Unknown Visitor"
                                                className="visitor-image"
                                            />

                                            <div className="visitor-image-overlay">
                                                <span>
                                                    UNKNOWN
                                                </span>
                                            </div>

                                        </div>

                                        <div className="visitor-card-content">

                                            <div className="visitor-card-top">

                                                <div>
                                                    <span className="visitor-label">
                                                        VISITOR ID
                                                    </span>

                                                    <h3>
                                                        {visitor.visitor_code}
                                                    </h3>
                                                </div>

                                                <div className="visitor-warning-icon">
                                                    !
                                                </div>

                                            </div>

                                            <div className="visitor-details">

                                                <div>
                                                    <span>
                                                        DATE
                                                    </span>

                                                    <strong>
                                                        {visitor.date}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>
                                                        TIME
                                                    </span>

                                                    <strong>
                                                        {visitor.time}
                                                    </strong>
                                                </div>

                                            </div>

                                            <div className="visitor-status">
                                                <span></span>
                                                Identity not recognized
                                            </div>

                                        </div>

                                    </article>

                                ))}

                            </div>

                        </section>
                    )}

            </main>

        </div>
    );
}

export default UnknownVisitors;