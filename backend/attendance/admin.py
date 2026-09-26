from django.contrib import admin
from .models import (
    RegisteredUser,
    Attendance,
    UnknownVisitor,
    FaceImage
)

@admin.register(RegisteredUser)
class RegisteredUserAdmin(admin.ModelAdmin):
    list_display = (
        'user_id',
        'name',
        'email',
        'department',
        'is_active',
        'created_at',
    )

    search_fields = (
        'user_id',
        'name',
        'email',
    )


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'date',
        'time',
        'attendance_status',
        'mask_status',
    )

    list_filter = (
        'date',
        'mask_status',
        'attendance_status',
    )

    search_fields = (
        'user__name',
        'user__user_id',
    )


@admin.register(UnknownVisitor)
class UnknownVisitorAdmin(admin.ModelAdmin):
    list_display = (
        'visitor_code',
        'date',
        'time',
        'created_at',
    )

    search_fields = (
        'visitor_code',
    )


@admin.register(FaceImage)
class FaceImageAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'created_at'
    )

    search_fields = (
        'user__user_id',
        'user__name'
    )