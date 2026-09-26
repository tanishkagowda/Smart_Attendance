from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Q
from attendance.models import RegisteredUser, Attendance, UnknownVisitor, FaceImage
import json
import face_recognition
import cv2
import numpy as np
from ultralytics import YOLO

MASK_MODEL_PATH = "mask_detection/mask_detector.pt"
mask_model = YOLO(MASK_MODEL_PATH)

from attendance.models import (
    RegisteredUser,
    Attendance,
    UnknownVisitor
)


# =========================================================
# ADMIN LOGIN
# =========================================================

@csrf_exempt
def admin_login(request):

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "Only POST method is allowed."
            },
            status=405
        )

    try:
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            return JsonResponse(
                {
                    "success": False,
                    "message": "Username and password are required."
                },
                status=400
            )

        user = authenticate(
            username=username,
            password=password
        )

        if user is not None and user.is_staff:
            return JsonResponse(
                {
                    "success": True,
                    "message": "Login successful.",
                    "username": user.username
                },
                status=200
            )

        return JsonResponse(
            {
                "success": False,
                "message": "Invalid admin credentials."
            },
            status=401
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {
                "success": False,
                "message": "Invalid JSON request."
            },
            status=400
        )


# =========================================================
# DASHBOARD STATISTICS
# =========================================================

def dashboard_stats(request):

    if request.method != "GET":
        return JsonResponse(
            {
                "success": False,
                "message": "Only GET method is allowed."
            },
            status=405
        )

    today = timezone.localdate()

    registered_users = RegisteredUser.objects.filter(
        is_active=True
    ).count()

    today_attendance = Attendance.objects.filter(
        date=today
    ).count()

    unknown_visitors = UnknownVisitor.objects.filter(
        date=today
    ).count()

    return JsonResponse(
        {
            "success": True,
            "registered_users": registered_users,
            "today_attendance": today_attendance,
            "unknown_visitors": unknown_visitors
        }
    )


# =========================================================
# REGISTER NEW USER
# =========================================================
@csrf_exempt
def register_user(request):
    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "Only POST method is allowed."
            },
            status=405
        )

    try:
        data = json.loads(request.body)

        user_id = data.get("user_id")
        name = data.get("name")
        email = data.get("email")
        department = data.get("department")
        phone = data.get("phone")

        if not user_id or not name:
            return JsonResponse(
                {
                    "success": False,
                    "message": "User ID and name are required."
                },
                status=400
            )

        if RegisteredUser.objects.filter(
            user_id=user_id
        ).exists():
            return JsonResponse(
                {
                    "success": False,
                    "message": "User ID already exists."
                },
                status=400
            )

        user = RegisteredUser.objects.create(
            user_id=user_id,
            name=name,
            email=email,
            department=department,
            phone=phone
        )

        return JsonResponse(
            {
                "success": True,
                "message": "User registered successfully.",
                "user": {
                    "id": user.id,
                    "user_id": user.user_id,
                    "name": user.name
                }
            },
            status=201
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {
                "success": False,
                "message": "Invalid JSON request."
            },
            status=400
        )


# =========================================================
# ATTENDANCE RECORDS
# =========================================================

def attendance_records(request):

    if request.method != "GET":
        return JsonResponse(
            {
                "success": False,
                "message": "Only GET method is allowed."
            },
            status=405
        )

    # Get ALL attendance records
    records = Attendance.objects.select_related(
        "user"
    ).order_by(
        "-date",
        "-time"
    )

    # -----------------------------------------------------
    # GET FILTER VALUES
    # -----------------------------------------------------

    from_date = request.GET.get("from_date")
    to_date = request.GET.get("to_date")
    department = request.GET.get("department")
    user_id = request.GET.get("user_id")

    # -----------------------------------------------------
    # FILTER BY START DATE
    # -----------------------------------------------------

    if from_date:
        records = records.filter(
            date__gte=from_date
        )

    # -----------------------------------------------------
    # FILTER BY END DATE
    # -----------------------------------------------------

    if to_date:
        records = records.filter(
            date__lte=to_date
        )

    # -----------------------------------------------------
    # FILTER BY DEPARTMENT
    # -----------------------------------------------------

    if department:
        records = records.filter(
            user__department=department
        )

    # -----------------------------------------------------
    # FILTER BY USER ID OR NAME
    # -----------------------------------------------------

    if user_id:
        records = records.filter(
            Q(user__user_id__icontains=user_id)
            |
            Q(user__name__icontains=user_id)
        )

    # -----------------------------------------------------
    # CONVERT DATABASE RECORDS TO JSON
    # -----------------------------------------------------

    data = []

    for record in records:

        data.append(
            {
                "id": record.id,

                "date": record.date.strftime(
                    "%Y-%m-%d"
                ),

                "time": record.time.strftime(
                    "%H:%M:%S"
                ),

                "user_id": record.user.user_id,

                "name": record.user.name,

                "department": record.user.department,

                "attendance_status": (
                    record.attendance_status
                ),

                "mask_status": (
                    record.mask_status
                )
            }
        )

    # -----------------------------------------------------
    # SEND RESPONSE
    # -----------------------------------------------------

    return JsonResponse(
        {
            "success": True,
            "count": len(data),
            "records": data
        }
    )




def departments(request):
    if request.method != "GET":
        return JsonResponse(
            {
                "success": False,
                "message": "Only GET method is allowed."
            },
            status=405
        )

    department_list = (
        RegisteredUser.objects
        .exclude(department__isnull=True)
        .exclude(department="")
        .values_list("department", flat=True)
        .distinct()
        .order_by("department")
    )

    return JsonResponse(
        {
            "success": True,
            "departments": list(department_list)
        }
    )



def create_face_encodings(user):
    """
    Generate face encodings for all valid face images
    belonging to a registered user.
    """

    encodings = []
    failed_images = []

    face_images = FaceImage.objects.filter(
        user=user
    )

    for face_image in face_images:

        try:

            image_path = face_image.image.path

            image = face_recognition.load_image_file(
                image_path
            )

            face_locations = face_recognition.face_locations(
                image
            )

            if len(face_locations) != 1:

                failed_images.append({
                    "image": face_image.image.name,
                    "reason": (
                        f"Expected 1 face, "
                        f"found {len(face_locations)}"
                    )
                })

                continue

            face_encoding = face_recognition.face_encodings(
                image,
                face_locations
            )[0]

            encodings.append(
                face_encoding.tolist()
            )

        except Exception as error:

            failed_images.append({
                "image": face_image.image.name,
                "reason": str(error)
            })

    if not encodings:
        return None, failed_images

    user.face_encoding = encodings
    user.save()

    return encodings, failed_images



def create_face_encodings(user):
    """
    Generate face encodings for all face images
    belonging to a registered user.
    """

    encodings = []
    failed_images = []

    face_images = FaceImage.objects.filter(
        user=user
    )

    for face_image in face_images:

        try:
            image_path = face_image.image.path

            image = face_recognition.load_image_file(
                image_path
            )

            face_locations = face_recognition.face_locations(
                image
            )

            if len(face_locations) != 1:
                failed_images.append({
                    "image": face_image.image.name,
                    "reason": (
                        f"Expected 1 face, "
                        f"found {len(face_locations)}"
                    )
                })
                continue

            face_encoding = face_recognition.face_encodings(
                image,
                face_locations
            )[0]

            encodings.append(
                face_encoding.tolist()
            )

        except Exception as error:
            failed_images.append({
                "image": face_image.image.name,
                "reason": str(error)
            })

    if not encodings:
        return None, failed_images

    user.face_encoding = encodings
    user.save()

    return encodings, failed_images

@csrf_exempt
def capture_face_images(request, user_id):

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "Only POST method is allowed."
            },
            status=405
        )

    try:
        user = RegisteredUser.objects.get(
            id=user_id,
            is_active=True
        )

    except RegisteredUser.DoesNotExist:
        return JsonResponse(
            {
                "success": False,
                "message": "Registered user not found."
            },
            status=404
        )

    images = request.FILES.getlist("images")

    if not images:
        return JsonResponse(
            {
                "success": False,
                "message": "No face images were uploaded."
            },
            status=400
        )

    if len(images) < 10:
        return JsonResponse(
            {
                "success": False,
                "message": "Please upload at least 10 face images."
            },
            status=400
        )

    # ---------------------------------------------------------
    # SAVE FACE IMAGES
    # ---------------------------------------------------------

    saved_images = []

    for image in images:

        face_image = FaceImage.objects.create(
            user=user,
            image=image
        )

        saved_images.append(face_image.id)

    # ---------------------------------------------------------
    # AUTOMATICALLY GENERATE FACE ENCODINGS
    # ---------------------------------------------------------

    encodings, failed_images = create_face_encodings(user)

    if not encodings:

        return JsonResponse(
            {
                "success": False,
                "message": (
                    "Face images were saved, "
                    "but no valid face encodings "
                    "could be generated."
                ),
                "image_count": len(saved_images),
                "failed_count": len(failed_images),
                "failed_images": failed_images
            },
            status=400
        )

    # ---------------------------------------------------------
    # SUCCESS
    # ---------------------------------------------------------

    return JsonResponse(
        {
            "success": True,
            "message": (
                "Face registration completed successfully."
            ),
            "user_id": user.user_id,
            "image_count": len(saved_images),
            "encoding_count": len(encodings),
            "failed_count": len(failed_images),
            "failed_images": failed_images
        },
        status=201
    )


@csrf_exempt
def generate_face_encoding(request, user_id):

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "Only POST method is allowed."
            },
            status=405
        )

    try:
        user = RegisteredUser.objects.get(
            id=user_id,
            is_active=True
        )

    except RegisteredUser.DoesNotExist:
        return JsonResponse(
            {
                "success": False,
                "message": "Registered user not found."
            },
            status=404
        )

    encodings, failed_images = create_face_encodings(user)

    if not encodings:

        return JsonResponse(
            {
                "success": False,
                "message": (
                    "No valid face encodings "
                    "could be generated."
                ),
                "failed_images": failed_images
            },
            status=400
        )

    return JsonResponse(
        {
            "success": True,
            "message": (
                "Face encodings generated "
                "and saved successfully."
            ),
            "user_id": user.user_id,
            "encoding_count": len(encodings),
            "failed_count": len(failed_images),
            "failed_images": failed_images
        },
        status=200
    )

@csrf_exempt
def recognize_face(request):
    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Only POST method is allowed."
        }, status=405)

    image = request.FILES.get("image")

    if not image:
        return JsonResponse({
            "success": False,
            "message": "No image was uploaded."
        }, status=400)

    try:
        # Read uploaded image
        image_data = face_recognition.load_image_file(
            image
        )

        # Detect faces
        face_locations = face_recognition.face_locations(
            image_data
        )

        if len(face_locations) == 0:
            return JsonResponse({
                "success": False,
                "recognized": False,
                "message": "No face detected."
            }, status=400)

        if len(face_locations) > 1:
            return JsonResponse({
                "success": False,
                "recognized": False,
                "message": "Multiple faces detected. Please keep only one person in front of the camera."
            }, status=400)

        # Generate encoding for the camera image
        face_encodings = face_recognition.face_encodings(
            image_data,
            face_locations
        )

        if not face_encodings:
            return JsonResponse({
                "success": False,
                "recognized": False,
                "message": "Could not generate face encoding."
            }, status=400)

        unknown_encoding = face_encodings[0]

        # Get active registered users
        users = RegisteredUser.objects.filter(
            is_active=True
        )

        best_match = None
        best_distance = None

        for user in users:

            if not user.face_encoding:
                continue

            registered_encodings = [
                encoding
                for encoding in user.face_encoding
            ]

            distances = face_recognition.face_distance(
                registered_encodings,
                unknown_encoding
            )

            if len(distances) == 0:
                continue

            minimum_distance = min(distances)

            if (
                best_distance is None
                or minimum_distance < best_distance
            ):
                best_distance = minimum_distance
                best_match = user

        # Recognition threshold
        threshold = 0.50

        if best_match is not None and best_distance <= threshold:

            return JsonResponse({
                "success": True,
                "recognized": True,
                "message": "Face recognized successfully.",
                "user": {
                    "id": best_match.id,
                    "user_id": best_match.user_id,
                    "name": best_match.name,
                    "department": best_match.department
                },
                "distance": float(best_distance)
            })

        return JsonResponse({
            "success": True,
            "recognized": False,
            "message": "Unknown face.",
            "distance": float(best_distance)
            if best_distance is not None
            else None
        })

    except Exception as error:

        return JsonResponse({
            "success": False,
            "recognized": False,
            "message": "Face recognition failed.",
            "error": str(error)
        }, status=500)

    

@csrf_exempt
def mark_attendance(request):
    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Only POST method is allowed."
        }, status=405)

    try:
        data = json.loads(request.body)
        user_id = data.get("user_id")

        if not user_id:
            return JsonResponse({
                "success": False,
                "message": "User ID is required."
            }, status=400)

        user = RegisteredUser.objects.get(
            id=user_id,
            is_active=True
        )

        today = timezone.localdate()
        current_time = timezone.localtime().time()


        attendance = Attendance.objects.create(
            user=user,
            date=today,
            time=current_time,
            attendance_status="Present",
            mask_status="PENDING"
        )

        return JsonResponse({
            "success": True,
            "message": "Attendance marked successfully.",
            "attendance": {
                "id": attendance.id,
                "user_id": user.user_id,
                "name": user.name,
                "date": str(attendance.date),
                "time": str(attendance.time),
                "mask_status": attendance.mask_status
            }
        }, status=201)

    except RegisteredUser.DoesNotExist:
        return JsonResponse({
            "success": False,
            "message": "Registered user not found."
        }, status=404)

    except json.JSONDecodeError:
        return JsonResponse({
            "success": False,
            "message": "Invalid JSON request."
        }, status=400)

    except Exception as error:
        return JsonResponse({
            "success": False,
            "message": "Failed to mark attendance.",
            "error": str(error)
        }, status=500)    



@csrf_exempt
def detect_mask(request):
    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Only POST method is allowed."
        }, status=405)

    image = request.FILES.get("image")

    if not image:
        return JsonResponse({
            "success": False,
            "message": "No image was uploaded."
        }, status=400)

    try:
        # Read uploaded image
        image_data = np.frombuffer(
            image.read(),
            np.uint8
        )

        frame = cv2.imdecode(
            image_data,
            cv2.IMREAD_COLOR
        )

        if frame is None:
            return JsonResponse({
                "success": False,
                "message": "Invalid image."
            }, status=400)

        # Run YOLO mask detection
        results = mask_model(
            frame,
            conf=0.5,
            verbose=False
        )

        detections = []

        for result in results:
            if result.boxes is None:
                continue

            for box in result.boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])

                class_name = mask_model.names[class_id]

                detections.append({
                    "class": class_name,
                    "confidence": round(confidence, 3)
                })

        if not detections:
            return JsonResponse({
                "success": True,
                "detected": False,
                "message": "No mask or face detected."
            })

        # Find the highest-confidence detection
        best_detection = max(
            detections,
            key=lambda x: x["confidence"]
        )

        detected_class = best_detection["class"]
        confidence = best_detection["confidence"]
        print("MASK DEBUG:", detected_class, confidence, detections)

        if detected_class == "mask":
            mask_status = "YES"
        elif detected_class == "no-mask":
            mask_status = "NO"
        else:
            mask_status = "PENDING"

        return JsonResponse({
            "success": True,
            "detected": True,
            "mask_status": mask_status,
            "class": detected_class,
            "confidence": confidence,
            "detections": detections
        })

    except Exception as error:
        return JsonResponse({
            "success": False,
            "message": "Mask detection failed.",
            "error": str(error)
        }, status=500)


@csrf_exempt
def update_mask_status(request):
    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Only POST method is allowed."
        }, status=405)

    try:
        data = json.loads(request.body)

        attendance_id = data.get("attendance_id")
        mask_status = data.get("mask_status")

        if not attendance_id:
            return JsonResponse({
                "success": False,
                "message": "Attendance ID is required."
            }, status=400)

        if mask_status not in ["YES", "NO"]:
            return JsonResponse({
                "success": False,
                "message": "Mask status must be YES or NO."
            }, status=400)

        attendance = Attendance.objects.get(
            id=attendance_id
        )

        attendance.mask_status = mask_status
        attendance.save()

        return JsonResponse({
            "success": True,
            "message": "Mask status updated successfully.",
            "attendance": {
                "id": attendance.id,
                "user_id": attendance.user.user_id,
                "name": attendance.user.name,
                "date": str(attendance.date),
                "time": str(attendance.time),
                "mask_status": attendance.mask_status
            }
        })

    except Attendance.DoesNotExist:
        return JsonResponse({
            "success": False,
            "message": "Attendance record not found."
        }, status=404)

    except json.JSONDecodeError:
        return JsonResponse({
            "success": False,
            "message": "Invalid JSON request."
        }, status=400)

    except Exception as error:
        return JsonResponse({
            "success": False,
            "message": "Failed to update mask status.",
            "error": str(error)
        }, status=500)
    

# =========================================================
# SAVE UNKNOWN VISITOR
# =========================================================

@csrf_exempt
def save_unknown_visitor(request):

    if request.method != "POST":
        return JsonResponse({
            "success": False,
            "message": "Only POST method is allowed."
        }, status=405)

    try:
        image = request.FILES.get("image")

        if not image:
            return JsonResponse({
                "success": False,
                "message": "Visitor image is required."
            }, status=400)

        now = timezone.localtime()

        visitor_code = (
            "VISITOR-"
            + now.strftime("%Y%m%d%H%M%S%f")
        )

        visitor = UnknownVisitor.objects.create(
            visitor_code=visitor_code,
            image=image,
            date=now.date(),
            time=now.time()
        )

        return JsonResponse({
            "success": True,
            "message": "Unknown visitor recorded successfully.",
            "visitor": {
                "id": visitor.id,
                "visitor_code": visitor.visitor_code,
                "date": str(visitor.date),
                "time": str(visitor.time),
                "image": visitor.image.url
            }
        }, status=201)

    except Exception as error:

        return JsonResponse({
            "success": False,
            "message": "Failed to save unknown visitor.",
            "error": str(error)
        }, status=500)

# =========================================================
# UNKNOWN VISITOR RECORDS
# =========================================================

def unknown_visitors(request):

    if request.method != "GET":
        return JsonResponse({
            "success": False,
            "message": "Only GET method is allowed."
        }, status=405)

    visitors = UnknownVisitor.objects.all().order_by(
        "-date",
        "-time"
    )

    data = []

    for visitor in visitors:
        data.append({
            "id": visitor.id,
            "visitor_code": visitor.visitor_code,
            "date": visitor.date.strftime("%Y-%m-%d"),
            "time": visitor.time.strftime("%H:%M:%S"),
            "image": visitor.image.url
        })

    return JsonResponse({
        "success": True,
        "count": len(data),
        "visitors": data
    })