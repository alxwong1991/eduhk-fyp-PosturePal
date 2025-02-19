import cv2
import asyncio
import base64
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from modules.camera import Camera
from exercises.exercise_helper import ExerciseHelper

app = FastAPI()
camera = Camera()
exercise_helper = ExerciseHelper()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ✅ Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Welcome to PosturePal Backend!"}

@app.websocket("/ws/start_bicep_curls")
async def start_bicep_curls(websocket: WebSocket):
    await websocket.accept()
    camera.start_capture()
    exercise_helper.setup_bicep_curls()

    counter = 0  # Reset the counter before starting the exercise

    # Emit the countdown values to the client
    countdown_duration = 5
    for countdown in range(countdown_duration, 0, -1):
        await websocket.send_json({"event": "display_countdown", "countdown": countdown})
        await asyncio.sleep(1)  # Wait for 1 second before the next countdown

    exercise_helper.bicep_curls.timer_instance.start()

    while camera.cap.isOpened():
        ret, frame = camera.read_frame()

        # Check if frame was successfully captured
        if not ret:
            break

        # Perform bicep curls exercise using the Exercise instance
        frame, angle, counter = exercise_helper.perform_bicep_curls(frame)

        # Encode frame as Base64
        _, buffer = cv2.imencode(".jpg", frame)
        base64_frame = base64.b64encode(buffer).decode("utf-8")

        remaining_time = exercise_helper.bicep_curls.timer_instance.get_remaining_time()

        # Check if image size is valid before displaying
        # if frame is not None and frame.shape[0] > 0 and frame.shape[1] > 0:
        #     cv2.imshow('Mediapipe Feed Bicep Curls', frame)

        # Send updated counter & remaining time to frontend
        await websocket.send_json({
            "event": "update_frame",
            "image": base64_frame,
            "counter": counter,
            "remaining_time": remaining_time
        })

        if remaining_time <= 0:
            # Emit exercise finished event
            await websocket.send_json({
                "event": "exercise_finished",
                "counter": counter
            })

            # Emit Swal.fire alert event
            await websocket.send_json({
                "event": "display_alert",
                "title": "Exercise Finished",
                "text": "You have completed the exercise!",
                "icon": "success"
            })

            break

        # ✅ Prevents blocking the event loop
        await asyncio.sleep(0.1)

        # if cv2.waitKey(10) & 0xFF == ord('q'):
        #     break
    
    # Close the OpenCV window before releasing the camera
    # cv2.destroyAllWindows()

    # Release the camera capture
    camera.release_capture()

    # Close WebSocket connection
    await websocket.close()