import cv2

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Could not open webcam.")
    exit()

print("Webcam opened.")
print("Press SPACE to capture the image.")
print("Press Q to quit.")

while True:
    ret, frame = cap.read()

    if not ret:
        print("Could not read webcam.")
        break

    cv2.imshow("Capture Test Image", frame)

    key = cv2.waitKey(1) & 0xFF

    if key == ord(" "):
        cv2.imwrite("../test_mask.jpg", frame)
        print("Image saved as D:\\SmartAttendance\\test_mask.jpg")
        break

    if key == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()