from django.db import models


class RegisteredUser(models.Model):
    user_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    department = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    face_encoding = models.JSONField(blank=True, null=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user_id} - {self.name}"



class FaceImage(models.Model):
    user = models.ForeignKey(
        RegisteredUser,
        on_delete=models.CASCADE,
        related_name="face_images"
    )

    image = models.ImageField(
        upload_to="registered_faces/"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.user.user_id} - Face Image"


class Attendance(models.Model):
    MASK_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('YES', 'Yes'),
        ('NO', 'No'),
    ]

    attendance_status = models.CharField(
        max_length=20,
        default='Present'
    )

    user = models.ForeignKey(
        RegisteredUser,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )

    date = models.DateField()
    time = models.TimeField()

    mask_status = models.CharField(
        max_length=10,
        choices=MASK_STATUS_CHOICES,
        default='PENDING'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.date} - {self.time}"


class UnknownVisitor(models.Model):
    visitor_code = models.CharField(
        max_length=50,
        unique=True
    )

    image = models.ImageField(
        upload_to='unknown_visitors/'
    )

    date = models.DateField()
    time = models.TimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.visitor_code} - {self.date} - {self.time}"
    