
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./maskVerification.css";
function MaskVerification() {
    const location = useLocation();
    const navigate = useNavigate();

    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const canvasRef = useRef(null);
    const detectionTimerRef = useRef(null);
    const detectionRunningRef = useRef(false);

    const [countdown, setCountdown] = useState(10);
    const [cameraActive, setCameraActive] = useState(false);
    const [message, setMessage] = useState(
        "Please wear your mask"
    );
    const [detecting, setDetecting] = useState(false);

    const user = location.state?.user;
    const attendance = location.state?.attendance;

    // Start countdown
    useEffect(() => {
        if (countdown <= 0) {
            startCamera();
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((previous) => previous - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    // Start camera
    const startCamera = async () => {
        try {
            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

            streamRef.current = stream;

            setCameraActive(true);
            setMessage("Please look at the camera");

        } catch (error) {
            console.error(error);

            setMessage(
                "Unable to access camera. Please allow camera permission."
            );
        }
    };

    // Attach stream after camera section renders
    useEffect(() => {
        if (
            cameraActive &&
            videoRef.current &&
            streamRef.current
        ) {
            videoRef.current.srcObject =
                streamRef.current;
        }
    }, [cameraActive]);

    // Automatic detection every 2 seconds
    useEffect(() => {
        if (!cameraActive) {
            return;
        }

        const timer = setInterval(() => {
            detectMask();
        }, 2000);

        detectionTimerRef.current = timer;

        return () => {
            clearInterval(timer);
            detectionTimerRef.current = null;
        };
    }, [cameraActive]);

    // Stop camera
    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current
                .getTracks()
                .forEach((track) => track.stop());

            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setCameraActive(false);
    };

    // Stop camera when leaving page
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    // Detect mask
    const detectMask = async () => {
        if (
            !videoRef.current ||
            !canvasRef.current ||
            detecting ||
            detectionRunningRef.current
        ) {
            return;
        }

        detectionRunningRef.current = true;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (
            video.readyState < 2 ||
            video.videoWidth === 0 ||
            video.videoHeight === 0
        ) {
            detectionRunningRef.current = false;
            return;
        }

        setDetecting(true);

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

        canvas.toBlob(
            async (blob) => {
                if (!blob) {
                    setDetecting(false);
                    detectionRunningRef.current = false;
                    return;
                }

                try {
                    const formData = new FormData();

                    formData.append(
                        "image",
                        blob,
                        "mask_frame.jpg"
                    );

                    const response = await api.post(
                        "/attendance/detect-mask/",
                        formData
                    );

                    console.log(
                        "Automatic mask detection:",
                        response.data
                    );

                    const maskStatus =
                        response.data.mask_status;

                    if (
                        maskStatus === "YES" ||
                        maskStatus === "NO"
                    ) {
                        const updateResponse =
                            await api.post(
                                "/attendance/update-mask-status/",
                                {
                                    attendance_id:
                                        attendance?.id,
                                    mask_status:
                                        maskStatus,
                                }
                            );

                        console.log(
                            "Mask status update:",
                            updateResponse.data
                        );

                        if (updateResponse.data.success) {
                            clearInterval(
                                detectionTimerRef.current
                            );

                            detectionTimerRef.current =
                                null;

                            stopCamera();

                            if (maskStatus === "YES") {
                                navigate(
                                    "/attendance-success",
                                    {
                                        state: {
                                            user,
                                            attendance:
                                                updateResponse
                                                    .data
                                                    .attendance,
                                        },
                                    }
                                );
                            } else {
                                navigate(
                                    "/mask-alert",
                                    {
                                        state: {
                                            user,
                                            attendance:
                                                updateResponse
                                                    .data
                                                    .attendance,
                                        },
                                    }
                                );
                            }
                        }
                    } else {
                        setMessage(
                            response.data.message ||
                            "Detecting mask..."
                        );
                    }

                } catch (error) {
                    console.error(
                        "Mask detection error:",
                        error
                    );

                    setMessage(
                        "Mask detection failed."
                    );

                } finally {
                    setDetecting(false);
                    detectionRunningRef.current = false;
                }
            },
            "image/jpeg",
            0.9
        );
    };

    return (
        <div className="mask-page">

            {/* Background effects */}
            <div className="mask-glow mask-glow-one"></div>
            <div className="mask-glow mask-glow-two"></div>

            {/* Navbar */}
            <nav className="mask-navbar">

                <button
                    className="mask-brand"
                    onClick={() => navigate("/")}
                >
                    <div className="mask-brand-icon">
                        ✦
                    </div>

                    <div>
                        <span>SmartAttend</span>
                        <small>
                            AI ATTENDANCE & SECURITY
                        </small>
                    </div>
                </button>

                <div className="mask-security-status">
                    <span></span>
                    Secure Verification
                </div>

            </nav>

            <main className="mask-main">

                {!cameraActive ? (

                    /* =====================================
                       COUNTDOWN SCREEN
                       ===================================== */
                    <section className="mask-countdown-screen">

                        <div className="mask-top-badge">
                            <span></span>
                            IDENTITY VERIFIED
                        </div>

                        <div className="mask-shield">
                            <div className="mask-shield-ring">
                                <div className="mask-shield-icon">
                                    ◈
                                </div>
                            </div>
                        </div>

                        <h1>
                            Please Wear Your <span>Mask</span>
                        </h1>

                        <p className="mask-greeting">
                            {user?.name
                                ? `Hello ${user.name}, one final security check is required.`
                                : "Attendance verification requires one final security check."}
                        </p>

                        <div className="mask-countdown-card">

                            <span>
                                CAMERA WILL OPEN IN
                            </span>

                            <div className="mask-countdown">
                                {countdown}
                            </div>

                            <div className="mask-countdown-progress">
                                <div
                                    style={{
                                        width: `${((10 - countdown) / 10) * 100}%`,
                                    }}
                                ></div>
                            </div>

                        </div>

                        <div className="mask-instruction">
                            <div>◉</div>

                            <span>
                                Please put on your mask and
                                be ready for verification.
                            </span>
                        </div>

                        <p className="mask-live-message">
                            {message}
                        </p>

                    </section>

                ) : (

                    /* =====================================
                       MASK CAMERA SCREEN
                       ===================================== */
                    <section className="mask-camera-screen">

                        <div className="mask-heading">

                            <div className="mask-top-badge">
                                <span className="active"></span>
                                MASK DETECTION ACTIVE
                            </div>

                            <h1>
                                Mask <span>Verification</span>
                            </h1>

                            <p>
                                Keep your face visible and
                                remain still while our AI
                                verifies your mask.
                            </p>

                        </div>

                        <div className="mask-layout">

                            {/* Camera */}
                            <div className="mask-camera-card">

                                <div className="mask-camera-header">

                                    <div>
                                        <h2>
                                            Security Camera
                                        </h2>

                                        <span>
                                            Real-time AI detection
                                        </span>
                                    </div>

                                    <div className="mask-live-indicator">
                                        <span></span>
                                        LIVE
                                    </div>

                                </div>

                                <div className="mask-video-container">

                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="mask-video"
                                    />

                                    <canvas
                                        ref={canvasRef}
                                        style={{
                                            display: "none",
                                        }}
                                    />

                                    {/* Face frame */}
                                    <div className="mask-face-frame">

                                        <div className="mask-corner top-left"></div>
                                        <div className="mask-corner top-right"></div>
                                        <div className="mask-corner bottom-left"></div>
                                        <div className="mask-corner bottom-right"></div>

                                        <div className="mask-scan-line"></div>

                                        <div className="mask-frame-label">
                                            <span></span>
                                            KEEP FACE VISIBLE
                                        </div>

                                    </div>

                                    {/* Detection overlay */}
                                    {detecting && (
                                        <div className="mask-detection-overlay">

                                            <div className="mask-loader"></div>

                                            <strong>
                                                Analyzing Mask
                                            </strong>

                                            <span>
                                                AI detection in progress...
                                            </span>

                                        </div>
                                    )}

                                </div>

                                <div className="mask-camera-footer">

                                    <div className="mask-camera-status">

                                        <span></span>

                                        {detecting
                                            ? "Analyzing frame..."
                                            : "Waiting for detection"}

                                    </div>

                                    <button
                                        className="mask-test-button"
                                        onClick={detectMask}
                                        disabled={detecting}
                                    >
                                        {detecting
                                            ? "Detecting..."
                                            : "Test Detection"}
                                    </button>

                                </div>

                            </div>

                            {/* Right information */}
                            <aside className="mask-side-panel">

                                {/* Current status */}
                                <div className="mask-info-card mask-status-card">

                                    <div className="mask-status-icon">
                                        ◈
                                    </div>

                                    <span>
                                        CURRENT STATUS
                                    </span>

                                    <h3>
                                        {detecting
                                            ? "Analyzing..."
                                            : "Checking Mask"}
                                    </h3>

                                    <p>
                                        The AI model is checking
                                        whether a mask is visible
                                        on your face.
                                    </p>

                                    <div className="mask-engine-status">
                                        <span></span>
                                        YOLO Detection Engine
                                    </div>

                                </div>

                                {/* Instructions */}
                                <div className="mask-info-card">

                                    <h3>
                                        Verification Tips
                                    </h3>

                                    <div className="mask-tips">

                                        <div>
                                            <span>01</span>
                                            <p>
                                                Wear your mask
                                                properly over
                                                your nose and mouth.
                                            </p>
                                        </div>

                                        <div>
                                            <span>02</span>
                                            <p>
                                                Keep your face
                                                clearly visible
                                                to the camera.
                                            </p>
                                        </div>

                                        <div>
                                            <span>03</span>
                                            <p>
                                                Remain still while
                                                detection is running.
                                            </p>
                                        </div>

                                    </div>

                                </div>

                                {/* Message */}
                                <div className="mask-message-card">
                                    <div className="mask-message-icon">
                                        ✦
                                    </div>

                                    <div>
                                        <strong>
                                            {message}
                                        </strong>

                                        <span>
                                            Automatic verification
                                            is running.
                                        </span>
                                    </div>
                                </div>

                            </aside>

                        </div>

                    </section>
                )}

            </main>

            <footer className="mask-footer">
                <span>SmartAttend</span>
                <span>
                    AI-Powered Attendance & Security
                </span>
                <span>© 2026</span>
            </footer>

        </div>
    );
}

export default MaskVerification;
