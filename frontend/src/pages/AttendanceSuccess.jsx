function AttendanceSuccess() {
    return (
        <div className="success-page">

            {/* Background Glow */}
            <div className="success-glow success-glow-one"></div>
            <div className="success-glow success-glow-two"></div>

            <div className="success-container">

                {/* Brand */}
                <div className="success-brand">
                    <div className="success-brand-icon">
                        ✦
                    </div>

                    <span>SmartAttend</span>
                </div>

                {/* Success Card */}
                <div className="success-card">

                    <div className="success-icon-wrapper">
                        <div className="success-icon-ring">
                            <div className="success-check">
                                ✓
                            </div>
                        </div>
                    </div>

                    <div className="success-badge">
                        <span></span>
                        ATTENDANCE VERIFIED
                    </div>

                    <h1>Attendance Completed</h1>

                    <p className="success-message">
                        Your attendance has been successfully recorded.
                    </p>

                    <div className="success-info">

                        <div className="success-info-line">
                            <span className="success-info-icon">
                                ◉
                            </span>

                            <span>
                                Identity successfully verified
                            </span>

                            <strong>✓</strong>
                        </div>

                        <div className="success-info-line">
                            <span className="success-info-icon">
                                ◷
                            </span>

                            <span>
                                Attendance recorded securely
                            </span>

                            <strong>✓</strong>
                        </div>

                    </div>

                    <div className="success-footer">
                        <span className="success-status-dot"></span>
                        Your attendance data is securely stored
                    </div>

                </div>

                <p className="success-bottom-text">
                    SmartAttend • AI-Powered Attendance & Security
                </p>

            </div>
        </div>
    );
}

export default AttendanceSuccess;