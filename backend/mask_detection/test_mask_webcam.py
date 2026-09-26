
import cv2
from ultralytics import YOLO

# Load mask detection model
model = YOLO("mask_detector.pt")

# Open webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("ERROR: Could not open webcam.")
    exit()

print("Webcam started.")
print("Press Q to quit.")

while True:
    ret, frame = cap.read()

    if not ret:
        print("ERROR: Could not read frame.")
        break

    # Run mask detection
    results = model(frame, conf=0.5, verbose=False)

    # Draw detection results
    annotated_frame = results[0].plot()

    # Show camera
    cv2.imshow("Mask Detection Test", annotated_frame)

    # Press Q to exit
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()

