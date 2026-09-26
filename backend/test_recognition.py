import requests

url = "http://127.0.0.1:8000/api/attendance/recognize/"

image_path = r"media\registered_faces\face_1.jpg"

with open(image_path, "rb") as image_file:
    files = {
        "image": image_file
    }

    response = requests.post(
        url,
        files=files
    )

print("Status code:", response.status_code)
print("Response:")
print(response.json())