from django.urls import path
from .views import (
    admin_login,
    dashboard_stats,
    register_user,
    attendance_records,
    departments,
    capture_face_images,
    generate_face_encoding,
    recognize_face,
    mark_attendance,
    detect_mask,
    update_mask_status,
    save_unknown_visitor,
    unknown_visitors
)

urlpatterns = [
    path(
        "auth/login/",
        admin_login,
        name="admin-login"
    ),

    path(
        "dashboard/stats/",
        dashboard_stats,
        name="dashboard-stats"
    ),

    path(
        "users/register/",
        register_user,
        name="register-user"
    ),

    path(
        "attendance/",
        attendance_records,
        name="attendance-records"
    ),

    path(
    "departments/",
    departments,
    name="departments"
    ),

    path(
    "users/<int:user_id>/capture-face/",
    capture_face_images,
    name="capture-face"
),
path(
    "users/<int:user_id>/generate-encoding/",
    generate_face_encoding,
    name="generate-face-encoding"
),

path(
    "attendance/recognize/",
    recognize_face,
    name="recognize-face"
),

path(
    "attendance/mark/",
    mark_attendance,
    name="mark-attendance"
),

path(
    "attendance/detect-mask/",
    detect_mask,
    name="detect-mask"
),

path(
    "attendance/update-mask-status/",
    update_mask_status,
    name="update-mask-status"
),

path(
    "attendance/unknown-visitor/",
    save_unknown_visitor,
    name="save-unknown-visitor"
),

path(
    "unknown-visitors/",
    unknown_visitors,
    name="unknown-visitors"
), 
]