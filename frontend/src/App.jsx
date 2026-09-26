import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import MarkAttendance from "./pages/MarkAttendance";
import MaskVerification from "./pages/MaskVerification";
import AttendanceSuccess from "./pages/AttendanceSuccess";
import MaskAlert from "./pages/MaskAlert";
import AdminDashboard from "./pages/AdminDashboard";
import AttendanceRecords from "./pages/AttendanceRecords";
import UnknownVisitors from "./pages/UnknownVisitors";
import RegisterUser from "./pages/RegisterUser";
import FaceCapture from "./pages/FaceCapture";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* =========================
                    PUBLIC PAGES
                ========================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/admin-login"
                    element={<AdminLogin />}
                />

                {/* =========================
                    ATTENDANCE FLOW
                ========================= */}

                <Route
                    path="/mark-attendance"
                    element={<MarkAttendance />}
                />

                <Route
                    path="/mask-verification"
                    element={<MaskVerification />}
                />

                <Route
                    path="/mask-alert"
                    element={<MaskAlert />}
                />

                <Route
                    path="/attendance-success"
                    element={<AttendanceSuccess />}
                />

                {/* =========================
                    ADMIN
                ========================= */}

                <Route
                    path="/admin-dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/attendance-records"
                    element={<AttendanceRecords />}
                />

                <Route
                    path="/unknown-visitors"
                    element={<UnknownVisitors />}
                />

                <Route
                    path="/register-user"
                    element={<RegisterUser />}
                />

                <Route
                    path="/face-capture/:userId"
                    element={<FaceCapture />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;