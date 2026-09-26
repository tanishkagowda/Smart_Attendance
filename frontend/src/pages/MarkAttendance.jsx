
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function MarkAttendance() {
    const navigate = useNavigate();

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const canvasRef = useRef(null);

    const [cameraActive, setCameraActive] = useState(false);
    const [recognizing, setRecognizing] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const startCamera = async () => {
        try {
            setError("");
            setMessage("");

            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });

            streamRef.current = stream;
            videoRef.current.srcObject = stream;

            setCameraActive(true);
        } catch (error) {
            console.error(error);

            setError(
                "Unable to access camera. Please allow camera permission."
            );
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
                track.stop();
            });

            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setCameraActive(false);
    };

    const recognizeFace = async () => {
        if (!videoRef.current || !cameraActive) {
            return;
        }

        try {
            setRecognizing(true);
            setError("");
            setMessage("Recognizing face...");

            const video = videoRef.current;
            const canvas = canvasRef.current;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext("2d");

            context.drawImage(
                video,
                0,
                0,
                canvas.width,
                canvas.height
            );

            const blob = await new Promise((resolve) => {
                canvas.toBlob(
                    resolve,
                    "image/jpeg",
                    0.9
                );
            });

            const formData = new FormData();

            formData.append(
                "image",
                blob,
                "attendance_face.jpg"
            );

            const response = await api.post(
                "/attendance/recognize/",
                formData
            );

            if (response.data.recognized) {
                const recognizedUser = response.data.user;

                setMessage(
                    `Face recognized: ${recognizedUser.name}`
                );

                console.log(
                    "Recognized user:",
                    recognizedUser
                );

                console.log(
                    "Face distance:",
                    response.data.distance
                );

                const attendanceResponse = await api.post(
                    "/attendance/mark/",
                    {
                        user_id: recognizedUser.id
                    }
                );

                console.log(
                    "Attendance response:",
                    attendanceResponse.data
                );

                if (attendanceResponse.data.success) {
                    stopCamera();

                    navigate("/mask-verification", {
                        state: {
                            user: recognizedUser,
                            attendance:
                                attendanceResponse.data.attendance
                        }
                    });
                }
            } else {
                setMessage(
                    "Unknown face detected. Saving visitor..."
                );

                const unknownVisitorFormData =
                    new FormData();

                unknownVisitorFormData.append(
                    "image",
                    blob,
                    "unknown_visitor.jpg"
                );

                const visitorResponse = await api.post(
                    "/attendance/unknown-visitor/",
                    unknownVisitorFormData
                );

                if (visitorResponse.data.success) {
                    stopCamera();

                    setMessage(
                        `Unknown visitor recorded: ${visitorResponse.data.visitor.visitor_code}`
                    );

                    console.log(
                        "Unknown visitor:",
                        visitorResponse.data.visitor
                    );
                } else {
                    setError(
                        visitorResponse.data.message ||
                        "Failed to save unknown visitor."
                    );
                }
            }
        } catch (error) {
            console.error(error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Face recognition failed."
                );
            } else {
                setError(
                    "Unable to connect to the server."
                );
            }
        } finally {
            setRecognizing(false);
        }
    };

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => {
                    track.stop();
                });
            }
        };
    }, []);

    return (
        <div className="attendance-page">

            {/* Background */}
            <div className="attendance-glow attendance-glow-one"></div>
            <div className="attendance-glow attendance-glow-two"></div>

            {/* Top Navigation */}
            <nav className="attendance-navbar">

                <button
                    className="attendance-brand"
                    onClick={() => navigate("/")}
                >
                    <div className="attendance-brand-icon">
                        ✦
                    </div>

                    <div>
                        <span>SmartAttend</span>
                        <small>AI ATTENDANCE & SECURITY</small>
                    </div>
                </button>

                <button
                    className="attendance-back-btn"
                    onClick={() => navigate("/")}
                >
                    ← Back to Home
                </button>

            </nav>

            <main className="attendance-main">

                {/* Header */}
                <div className="attendance-heading">

                    <div className="attendance-heading-badge">
                        <span></span>
                        SECURE ATTENDANCE
                    </div>

                    <h1>
                        Mark Your <span>Attendance</span>
                    </h1>

                    <p>
                        Position your face inside the frame and
                        let our AI securely verify your identity.
                    </p>

                </div>

                {/* Main Camera Area */}
                <div className="attendance-layout">

                    {/* Camera Card */}
                    <section className="camera-card">

                        <div className="camera-card-header">

                            <div>
                                <h2>Face Verification</h2>
                                <p>
                                    AI-powered identity recognition
                                </p>
                            </div>

                            <div
                                className={
                                    cameraActive
                                        ? "camera-status active"
                                        : "camera-status"
                                }
                            >
                                <span></span>
                                {cameraActive
                                    ? "CAMERA LIVE"
                                    : "CAMERA OFF"}
                            </div>

                        </div>

                        <div className="camera-container">

                            {!cameraActive && (
                                <div className="camera-placeholder">

                                    <div className="camera-placeholder-icon">
                                        ◉
                                    </div>

                                    <h3>
                                        Camera is ready
                                    </h3>

                                    <p>
                                        Start the camera to begin
                                        face verification.
                                    </p>

                                </div>
                            )}

                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className={
                                    cameraActive
                                        ? "camera-video active"
                                        : "camera-video"
                                }
                            />

                            {/* Face Recognition Frame */}
                            {cameraActive && (
                                <div className="face-frame">

                                    <div className="face-corner top-left"></div>
                                    <div className="face-corner top-right"></div>
                                    <div className="face-corner bottom-left"></div>
                                    <div className="face-corner bottom-right"></div>

                                    <div className="face-scan-line"></div>

                                    <div className="face-frame-label">
                                        <span></span>
                                        POSITION FACE HERE
                                    </div>

                                </div>
                            )}

                            {/* Recognition Overlay */}
                            {recognizing && (
                                <div className="recognition-overlay">

                                    <div className="recognition-spinner"></div>

                                    <strong>
                                        Analyzing Face
                                    </strong>

                                    <span>
                                        Please remain still...
                                    </span>

                                </div>
                            )}

                        </div>

                        {/* Camera Controls */}
                        <div className="camera-controls">

                            {!cameraActive ? (
                                <button
                                    className="attendance-primary-btn"
                                    onClick={startCamera}
                                >
                                    <span>◉</span>
                                    Start Camera
                                    <b>→</b>
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="attendance-primary-btn"
                                        onClick={recognizeFace}
                                        disabled={recognizing}
                                    >
                                        <span>
                                            {recognizing
                                                ? "◌"
                                                : "✦"}
                                        </span>

                                        {recognizing
                                            ? "Recognizing..."
                                            : "Recognize Face"}

                                        {!recognizing && (
                                            <b>→</b>
                                        )}
                                    </button>

                                    <button
                                        className="attendance-stop-btn"
                                        onClick={stopCamera}
                                        disabled={recognizing}
                                    >
                                        Stop Camera
                                    </button>
                                </>
                            )}

                        </div>

                        <canvas
                            ref={canvasRef}
                            style={{ display: "none" }}
                        />

                    </section>

                    {/* Information Panel */}
                    <aside className="attendance-info">

                        {/* Security Card */}
                        <div className="attendance-info-card security-info-card">

                            <div className="info-icon blue">
                                ✦
                            </div>

                            <h3>
                                AI Verification
                            </h3>

                            <p>
                                Your face is securely compared
                                against registered users in the
                                attendance system.
                            </p>

                            <div className="info-status">
                                <span></span>
                                Recognition Engine Ready
                            </div>

                        </div>

                        {/* Steps */}
                        <div className="attendance-info-card">

                            <h3>
                                How it works
                            </h3>

                            <div className="attendance-steps">

                                <div className="attendance-step">
                                    <div className="step-number">
                                        01
                                    </div>

                                    <div>
                                        <strong>
                                            Start Camera
                                        </strong>

                                        <span>
                                            Allow camera access
                                        </span>
                                    </div>
                                </div>

                                <div className="step-line"></div>

                                <div className="attendance-step">
                                    <div className="step-number">
                                        02
                                    </div>

                                    <div>
                                        <strong>
                                            Position Face
                                        </strong>

                                        <span>
                                            Keep your face inside
                                            the frame
                                        </span>
                                    </div>
                                </div>

                                <div className="step-line"></div>

                                <div className="attendance-step">
                                    <div className="step-number">
                                        03
                                    </div>

                                    <div>
                                        <strong>
                                            Verify Identity
                                        </strong>

                                        <span>
                                            AI recognizes your face
                                        </span>
                                    </div>
                                </div>

                                <div className="step-line"></div>

                                <div className="attendance-step">
                                    <div className="step-number">
                                        04
                                    </div>

                                    <div>
                                        <strong>
                                            Attendance Recorded
                                        </strong>

                                        <span>
                                            Continue to verification
                                        </span>
                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* Privacy Card */}
                        <div className="attendance-privacy">

                            <div className="privacy-icon">
                                ✓
                            </div>

                            <div>
                                <strong>
                                    Secure & Private
                                </strong>

                                <span>
                                    Camera access is used only
                                    for attendance verification.
                                </span>
                            </div>

                        </div>

                    </aside>

                </div>

                {/* Messages */}
                {error && (
                    <div className="attendance-message error">
                        <div>!</div>

                        <span>
                            {error}
                        </span>
                    </div>
                )}

                {message && !error && (
                    <div className="attendance-message success">
                        <div>✓</div>

                        <span>
                            {message}
                        </span>
                    </div>
                )}

            </main>

            <footer className="attendance-footer">
                <span>SmartAttend</span>
                <span>AI-Powered Attendance & Security</span>
                <span>© 2026</span>
            </footer>

        </div>
    );
}

export default MarkAttendance;
