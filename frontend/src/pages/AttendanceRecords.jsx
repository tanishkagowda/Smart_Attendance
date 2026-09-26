import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AttendanceRecords() {
    const navigate = useNavigate();

    const [records, setRecords] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] = useState({
        from_date: "",
        to_date: "",
        department: "",
        user_id: "",
    });

    const fetchAttendanceRecords = async (customFilters = {}) => {
        setLoading(true);
        setError("");

        try {
            const params = {};

            if (customFilters.from_date) {
                params.from_date = customFilters.from_date;
            }

            if (customFilters.to_date) {
                params.to_date = customFilters.to_date;
            }

            if (customFilters.department) {
                params.department = customFilters.department;
            }

            if (customFilters.user_id) {
                params.user_id = customFilters.user_id;
            }

            const response = await api.get("/attendance/", {
                params: params,
            });

            if (response.data.success) {
                setRecords(response.data.records);
            } else {
                setError("Unable to load attendance records.");
            }
        } catch (error) {
            console.error(error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Unable to load attendance records."
                );
            } else {
                setError("Unable to connect to the server.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Initially load ALL attendance records
        fetchAttendanceRecords({});

        // Load departments for the filter
        fetchDepartments();
    }, []);

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const handleFilterSubmit = (event) => {
        event.preventDefault();

        fetchAttendanceRecords(filters);
    };

    const handleClearFilters = () => {
        const emptyFilters = {
            from_date: "",
            to_date: "",
            department: "",
            user_id: "",
        };

        setFilters(emptyFilters);

        // Show all records again
        fetchAttendanceRecords({});
    };

    const fetchDepartments = async () => {
        try {
            const response = await api.get("/departments/");

            if (response.data.success) {
                setDepartments(response.data.departments);
            }
        } catch (error) {
            console.error("Unable to load departments:", error);
        }
    };

    return (
        <div className="records-page">

            {/* Top Navigation */}
            <header className="records-topbar">

                <button
                    className="records-back-btn"
                    onClick={() => navigate("/admin-dashboard")}
                >
                    <span>←</span>
                    Back to Dashboard
                </button>

                <div className="records-title-area">
                    <div className="records-title-icon">
                        ◫
                    </div>

                    <div>
                        <h1>Attendance Records</h1>
                        <p>Monitor and review attendance activity</p>
                    </div>
                </div>

                <button
                    className={`records-filter-toggle ${
                        showFilters ? "active" : ""
                    }`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <span>{showFilters ? "×" : "☷"}</span>
                    {showFilters ? "Hide Filters" : "Filters"}
                </button>

            </header>

            <main className="records-main">

                {/* Summary Bar */}
                <section className="records-summary">

                    <div className="records-summary-item">
                        <div className="records-summary-icon blue">
                            ◉
                        </div>

                        <div>
                            <span>Total Records</span>
                            <strong>{records.length}</strong>
                        </div>
                    </div>

                    <div className="records-summary-divider"></div>

                    <div className="records-summary-item">
                        <div className="records-summary-icon green">
                            ✓
                        </div>

                        <div>
                            <span>System Status</span>
                            <strong className="status-online">
                                Online
                            </strong>
                        </div>
                    </div>

                    <div className="records-summary-divider"></div>

                    <div className="records-summary-item">
                        <div className="records-summary-icon purple">
                            ◴
                        </div>

                        <div>
                            <span>Data Source</span>
                            <strong>Live Database</strong>
                        </div>
                    </div>

                </section>

                {/* Filter Panel */}
                {showFilters && (
                    <section className="records-filter-card fade-in">

                        <div className="records-filter-header">
                            <div>
                                <div className="filter-heading-icon">
                                    ☷
                                </div>

                                <div>
                                    <h2>Filter Attendance</h2>
                                    <p>
                                        Narrow down records using the
                                        available filters
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form
                            className="records-filter-form"
                            onSubmit={handleFilterSubmit}
                        >

                            <div className="records-filter-group">
                                <label>
                                    From Date
                                </label>

                                <div className="records-input-wrapper">
                                    <span>◷</span>

                                    <input
                                        type="date"
                                        name="from_date"
                                        value={filters.from_date}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>

                            <div className="records-filter-group">
                                <label>
                                    To Date
                                </label>

                                <div className="records-input-wrapper">
                                    <span>◷</span>

                                    <input
                                        type="date"
                                        name="to_date"
                                        value={filters.to_date}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>

                            <div className="records-filter-group">
                                <label>
                                    Department
                                </label>

                                <div className="records-input-wrapper">
                                    <span>⌘</span>

                                    <select
                                        name="department"
                                        value={filters.department}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">
                                            All Departments
                                        </option>

                                        {departments.map((department) => (
                                            <option
                                                key={department}
                                                value={department}
                                            >
                                                {department}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="records-filter-group">
                                <label>
                                    User ID / Name
                                </label>

                                <div className="records-input-wrapper">
                                    <span>⌕</span>

                                    <input
                                        type="text"
                                        name="user_id"
                                        value={filters.user_id}
                                        onChange={handleFilterChange}
                                        placeholder="Search user"
                                    />
                                </div>
                            </div>

                            <div className="records-filter-actions">

                                <button
                                    type="submit"
                                    className="records-apply-btn"
                                >
                                    <span>⌕</span>
                                    Apply Filters
                                </button>

                                <button
                                    type="button"
                                    className="records-clear-btn"
                                    onClick={handleClearFilters}
                                >
                                    Clear Filters
                                </button>

                            </div>

                        </form>

                    </section>
                )}

                {/* Records Section */}
                <section className="records-card">

                    <div className="records-card-header">

                        <div>
                            <h2>Attendance Activity</h2>

                            <p>
                                {records.length > 0
                                    ? `Showing ${records.length} attendance record${
                                          records.length !== 1
                                              ? "s"
                                              : ""
                                      }`
                                    : "No attendance records available"}
                            </p>
                        </div>

                        <div className="records-live-badge">
                            <span></span>
                            Live
                        </div>

                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="records-loading">

                            <div className="records-spinner"></div>

                            <h3>Loading attendance records</h3>

                            <p>
                                Fetching the latest attendance data...
                            </p>

                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="records-error">

                            <div className="records-error-icon">
                                !
                            </div>

                            <div>
                                <h3>Unable to load records</h3>
                                <p>{error}</p>
                            </div>

                        </div>
                    )}

                    {/* Empty */}
                    {!loading &&
                        !error &&
                        records.length === 0 && (
                            <div className="records-empty">

                                <div className="records-empty-icon">
                                    ◫
                                </div>

                                <h3>No attendance records found</h3>

                                <p>
                                    Try changing your filters or check
                                    back after attendance has been recorded.
                                </p>

                                <button
                                    className="records-empty-btn"
                                    onClick={handleClearFilters}
                                >
                                    Clear Filters
                                </button>

                            </div>
                        )}

                    {/* Table */}
                    {!loading &&
                        !error &&
                        records.length > 0 && (
                            <div className="records-table-wrapper">

                                <table className="records-table">

                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>User</th>
                                            <th>Name</th>
                                            <th>Department</th>
                                            <th>Attendance</th>
                                            <th>Mask Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {records.map((record) => (
                                            <tr key={record.id}>

                                                <td>
                                                    <div className="record-date">
                                                        <span className="date-icon">
                                                            ◷
                                                        </span>

                                                        <span>
                                                            {record.date}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="record-time">
                                                        {record.time}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="record-user-id">
                                                        {record.user_id}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="record-name">
                                                        <div className="record-avatar">
                                                            {record.name
                                                                ? record.name
                                                                      .charAt(0)
                                                                      .toUpperCase()
                                                                : "?"}
                                                        </div>

                                                        <span>
                                                            {record.name}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span className="record-department">
                                                        {record.department || "-"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`record-status ${
                                                            String(
                                                                record.attendance_status
                                                            ).toLowerCase() ===
                                                            "present"
                                                                ? "present"
                                                                : ""
                                                        }`}
                                                    >
                                                        <span></span>
                                                        {
                                                            record.attendance_status
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`mask-status ${
                                                            String(
                                                                record.mask_status
                                                            ).toLowerCase() ===
                                                            "yes"
                                                                ? "mask-yes"
                                                                : String(
                                                                      record.mask_status
                                                                  ).toLowerCase() ===
                                                                  "no"
                                                                ? "mask-no"
                                                                : "mask-pending"
                                                        }`}
                                                    >
                                                        {
                                                            record.mask_status
                                                        }
                                                    </span>
                                                </td>

                                            </tr>
                                        ))}

                                    </tbody>

                                </table>

                            </div>
                        )}

                </section>

            </main>

        </div>
    );
}

export default AttendanceRecords;