import face_recognition

image_path = r"media\registered_faces\face_1.jpg"

print("Loading image...")

image = face_recognition.load_image_file(
    image_path
)

print("Detecting face...")

face_locations = face_recognition.face_locations(
    image
)

print(
    "Number of faces detected:",
    len(face_locations)
)

if len(face_locations) == 1:

    print("Generating face encoding...")

    encodings = face_recognition.face_encodings(
        image,
        face_locations
    )

    encoding = encodings[0]

    print(
        "Encoding generated successfully!"
    )

    print(
        "Encoding length:",
        len(encoding)
    )

else:

    print(
        "Expected exactly one face."
    )