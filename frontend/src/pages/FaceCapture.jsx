import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./faceCapture.css";
function FaceCapture() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const [cameraStarted, setCameraStarted] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    const [capturedImages, setCapturedImages] = useState([]);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const startCamera = async () => {
        setError("");
        setMessage("");
        setVideoReady(false);

        try {
            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {
                setError(
                    "Camera access is not supported by this browser."
                );
                return;
            }

            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track) => track.stop());

                streamRef.current = null;
            }

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: {
                            ideal: 1280,
                        },
                        height: {
                            ideal: 720,
                        },
                        facingMode: "user",
                    },
                    audio: false,
                });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }

            setCameraStarted(true);
        } catch (error) {
            console.error("Camera error:", error);

            if (error.name === "NotAllowedError") {
                setError(
                    "Camera permission was denied. Please allow camera access in your browser."
                );
            } else if (error.name === "NotFoundError") {
                setError(
                    "No camera was found on this device."
                );
            } else if (error.name === "NotReadableError") {
                setError(
                    "Camera is already being used by another application."
                );
            } else {
                setError(
                    "Unable to access camera. Please check your camera permission."
                );
            }

            setCameraStarted(false);
        }
    };

    const handleVideoReady = () => {
        if (
            videoRef.current &&
            videoRef.current.videoWidth > 0 &&
            videoRef.current.videoHeight > 0
        ) {
            setVideoReady(true);
        }
    };

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

        setCameraStarted(false);
        setVideoReady(false);
    };

    const captureImage = () => {
        setError("");

        if (!videoRef.current) {
            setError("Camera video is not available.");
            return;
        }

        const video = videoRef.current;

        if (
            video.videoWidth === 0 ||
            video.videoHeight === 0
        ) {
            setError(
                "Camera is not ready yet. Please wait a moment."
            );
            return;
        }

        const canvas =
            document.createElement("canvas");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context =
            canvas.getContext("2d");

        if (!context) {
            setError(
                "Unable to capture the image."
            );
            return;
        }

        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );

        const image = canvas.toDataURL(
            "image/jpeg",
            0.9
        );

        setCapturedImages(
            (previousImages) => [
                ...previousImages,
                image,
            ]
        );
    };

    const uploadImages = async () => {
        if (capturedImages.length < 10) {
            setError(
                "Please capture at least 10 images."
            );
            return;
        }

        setUploading(true);
        setError("");
        setMessage("");

        try {
            const formData = new FormData();

            capturedImages.forEach(
                (image, index) => {
                    const byteString = atob(
                        image.split(",")[1]
                    );

                    const mimeString =
                        image
                            .split(",")[0]
                            .split(":")[1]
                            .split(";")[0];

                    const arrayBuffer =
                        new ArrayBuffer(
                            byteString.length
                        );

                    const intArray =
                        new Uint8Array(
                            arrayBuffer
                        );

                    for (
                        let i = 0;
                        i < byteString.length;
                        i++
                    ) {
                        intArray[i] =
                            byteString.charCodeAt(
                                i
                            );
                    }

                    const blob = new Blob(
                        [arrayBuffer],
                        {
                            type: mimeString,
                        }
                    );

                    formData.append(
                        "images",
                        blob,
                        `face_${index + 1}.jpg`
                    );
                }
            );

            const response =
                await api.post(
                    `/users/${userId}/capture-face/`,
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );

            if (response.data.success) {
                setMessage(
                    response.data.message +
                    ` ${response.data.image_count} images processed, ` +
                    `${response.data.encoding_count} face encodings generated.`
                );

                stopCamera();
            } else {
                setError(
                    response.data.message
                );
            }
        } catch (error) {
            console.error(
                "Upload error:",
                error
            );

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Face image upload failed."
                );
            } else {
                setError(
                    "Unable to connect to the server."
                );
            }
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach(
                        (track) =>
                            track.stop()
                    );
            }
        };
    }, []);

    return (
        <div className="face-capture-page">

            {/* Background Effects */}
            <div className="face-capture-glow face-glow-one"></div>
            <div className="face-capture-glow face-glow-two"></div>

            {/* Top Bar */}
            <header className="face-capture-topbar">

                <div className="face-capture-brand">
                    <div className="face-brand-icon">
                        ✦
                    </div>

                    <div>
                        <span>SmartAttend</span>
                        <small>AI ATTENDANCE & SECURITY</small>
                    </div>
                </div>

                <button
                    className="face-back-btn"
                    onClick={() =>
                        navigate("/admin-dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </header>

            <main className="face-capture-main">

                {/* Page Heading */}
                <section className="face-page-heading">

                    <div className="face-heading-badge">
                        <span></span>
                        FACE REGISTRATION
                    </div>

                    <h1>
                        Register Face Identity
                    </h1>

                    <p>
                        Capture clear facial images to create
                        a secure biometric identity for attendance.
                    </p>

                    <div className="face-user-pill">
                        <span>USER ID</span>
                        <strong>{userId}</strong>
                    </div>

                </section>

                {/* Main Workspace */}
                <section className="face-workspace">

                    {/* Camera Card */}
                    <div className="face-camera-card">

                        <div className="face-card-header">

                            <div>
                                <h2>
                                    Face Capture
                                </h2>

                                <p>
                                    Position the face inside the frame
                                </p>
                            </div>

                            <div
                                className={`camera-status ${
                                    cameraStarted
                                        ? "camera-active"
                                        : ""
                                }`}
                            >
                                <span></span>

                                {cameraStarted
                                    ? "Camera Active"
                                    : "Camera Off"}
                            </div>

                        </div>

                        {/* Camera */}
                        <div className="face-camera-container">

                            {!cameraStarted && (
                                <div className="camera-placeholder">

                                    <div className="camera-placeholder-icon">
                                        ◉
                                    </div>

                                    <h3>
                                        Camera is ready
                                    </h3>

                                    <p>
                                        Start the camera to begin
                                        capturing face images.
                                    </p>

                                </div>
                            )}

                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                onLoadedMetadata={
                                    handleVideoReady
                                }
                                className={`face-video ${
                                    cameraStarted
                                        ? "visible"
                                        : ""
                                }`}
                            />

                            {cameraStarted && (
                                <>
                                    <div className="face-corner top-left"></div>
                                    <div className="face-corner top-right"></div>
                                    <div className="face-corner bottom-left"></div>
                                    <div className="face-corner bottom-right"></div>

                                    <div className="face-guide">
                                        <div className="face-guide-circle"></div>
                                    </div>

                                    <div className="camera-live-label">
                                        <span></span>
                                        LIVE
                                    </div>
                                </>
                            )}

                        </div>

                        {/* Camera Controls */}
                        <div className="face-camera-controls">

                            {!cameraStarted ? (
                                <button
                                    className="face-primary-btn"
                                    onClick={startCamera}
                                >
                                    <span>◉</span>
                                    Start Camera
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="face-capture-btn"
                                        onClick={captureImage}
                                        disabled={!videoReady}
                                    >
                                        <span className="capture-circle">
                                            ●
                                        </span>

                                        {videoReady
                                            ? "Capture Face"
                                            : "Starting Camera..."}
                                    </button>

                                    <button
                                        className="face-stop-btn"
                                        onClick={stopCamera}
                                    >
                                        ■
                                        Stop Camera
                                    </button>
                                </>
                            )}

                        </div>

                        {/* Camera Hint */}
                        <div className="camera-hint">
                            <span>✦</span>
                            Keep your face clearly visible and
                            look directly at the camera.
                        </div>

                    </div>

                    {/* Right Side */}
                    <div className="face-side-panel">

                        {/* Progress */}
                        <div className="face-progress-card">

                            <div className="face-progress-header">

                                <div>
                                    <span>
                                        CAPTURE PROGRESS
                                    </span>

                                    <strong>
                                        {capturedImages.length}
                                        <small>/10</small>
                                    </strong>
                                </div>

                                <div className="progress-percentage">
                                    {Math.min(
                                        100,
                                        Math.round(
                                            (capturedImages.length /
                                                10) *
                                                100
                                        )
                                    )}
                                    %
                                </div>

                            </div>

                            <div className="face-progress-track">
                                <div
                                    className="face-progress-fill"
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            (capturedImages.length /
                                                10) *
                                                100
                                        )}%`,
                                    }}
                                ></div>
                            </div>

                            <p>
                                Capture at least 10 clear images
                                to continue.
                            </p>

                        </div>

                        {/* Instructions */}
                        <div className="face-instructions-card">

                            <h3>
                                Capture Guidelines
                            </h3>

                            <div className="instruction-item">
                                <div className="instruction-icon">
                                    ☀
                                </div>

                                <div>
                                    <strong>
                                        Good Lighting
                                    </strong>

                                    <p>
                                        Make sure your face is
                                        well illuminated.
                                    </p>
                                </div>
                            </div>

                            <div className="instruction-item">
                                <div className="instruction-icon">
                                    ◉
                                </div>

                                <div>
                                    <strong>
                                        Face Forward
                                    </strong>

                                    <p>
                                        Look directly at the camera
                                        for clear images.
                                    </p>
                                </div>
                            </div>

                            <div className="instruction-item">
                                <div className="instruction-icon">
                                    ◌
                                </div>

                                <div>
                                    <strong>
                                        Stay Clear
                                    </strong>

                                    <p>
                                        Avoid sunglasses, masks,
                                        or objects covering your face.
                                    </p>
                                </div>
                            </div>

                            <div className="instruction-item">
                                <div className="instruction-icon">
                                    ✦
                                </div>

                                <div>
                                    <strong>
                                        Change Angles
                                    </strong>

                                    <p>
                                        Slightly vary your face
                                        position between captures.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Upload */}
                        <div className="face-upload-card">

                            <div className="upload-status-icon">
                                {capturedImages.length >= 10
                                    ? "✓"
                                    : "↑"}
                            </div>

                            <div className="upload-status-text">
                                <strong>
                                    {capturedImages.length >= 10
                                        ? "Ready to process"
                                        : "Capture more images"}
                                </strong>

                                <span>
                                    {capturedImages.length >= 10
                                        ? "Your face data is ready."
                                        : `${10 - capturedImages.length} more image${
                                              10 -
                                                  capturedImages.length !==
                                              1
                                                  ? "s"
                                                  : ""
                                          } required`}
                                </span>
                            </div>

                        </div>

                    </div>

                </section>

                {/* Captured Images */}
                {capturedImages.length > 0 && (
                    <section className="captured-images-card">

                        <div className="captured-header">

                            <div>
                                <h2>
                                    Captured Images
                                </h2>

                                <p>
                                    Review the images before
                                    processing them.
                                </p>
                            </div>

                            <div className="captured-count">
                                {capturedImages.length} Images
                            </div>

                        </div>

                        <div className="captured-grid">

                            {capturedImages.map(
                                (image, index) => (
                                    <div
                                        className="captured-image-card"
                                        key={index}
                                    >
                                        <img
                                            src={image}
                                            alt={`Face ${index + 1}`}
                                        />

                                        <div className="captured-image-number">
                                            {String(
                                                index + 1
                                            ).padStart(2, "0")}
                                        </div>

                                        <div className="captured-check">
                                            ✓
                                        </div>
                                    </div>
                                )
                            )}

                        </div>

                    </section>
                )}

                {/* Messages */}
                {error && (
                    <div className="face-message face-error">
                        <div className="face-message-icon">
                            !
                        </div>

                        <div>
                            <strong>
                                Capture Error
                            </strong>

                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {message && (
                    <div className="face-message face-success">
                        <div className="face-message-icon">
                            ✓
                        </div>

                        <div>
                            <strong>
                                Face Registration Complete
                            </strong>

                            <p>{message}</p>
                        </div>
                    </div>
                )}

                {/* Bottom Action */}
                <section className="face-bottom-action">

                    <div>
                        <span className="secure-dot"></span>

                        <span>
                            Face data will be securely processed
                            for identity recognition.
                        </span>
                    </div>

                    <button
                        className="face-save-btn"
                        onClick={uploadImages}
                        disabled={
                            capturedImages.length < 10 ||
                            uploading
                        }
                    >
                        {uploading ? (
                            <>
                                <span className="button-spinner"></span>
                                Processing Face Data...
                            </>
                        ) : (
                            <>
                                ✓
                                Save Face Images
                                <span>
                                    ({capturedImages.length}/10)
                                </span>
                            </>
                        )}
                    </button>

                </section>

            </main>

        </div>
    );
}

export default FaceCapture;