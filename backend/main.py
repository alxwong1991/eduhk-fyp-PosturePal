import cv2
import asyncio
import base64
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from modules.camera import Camera
from exercises.exercise_helper import ExerciseHelper

app = FastAPI()
camera = Camera()
exercise_helper = ExerciseHelper()
streaming_active = False  # ✅ Controls streaming state

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ✅ Update with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Welcome to PosturePal Backend!"}

# ✅ MJPEG Streaming (Only Runs When Active)
def generate_frames():
    """Continuously capture frames and serve as MJPEG stream only when active."""
    global streaming_active
    camera.start_capture()
    
    while streaming_active:
        ret, frame = camera.read_frame()
        if not ret:
            break

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    camera.release_capture()

@app.get("/video_feed")
def video_feed():
    """Serve the webcam video as an MJPEG stream only if streaming is active."""
    global streaming_active
    if not streaming_active:
        return {"message": "Streaming is not active"}
    
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

# ✅ Start & Stop Streaming via API
@app.get("/start_streaming")
def start_streaming():
    global streaming_active
    streaming_active = True
    return {"message": "Streaming started"}

@app.get("/stop_streaming")
def stop_streaming():
    global streaming_active
    streaming_active = False
    return {"message": "Streaming stopped"}

# ✅ WebSocket for Exercise Tracking (Does NOT Handle MJPEG)
@app.websocket("/ws/start_bicep_curls")
async def start_bicep_curls(websocket: WebSocket):
    await websocket.accept()
    
    global streaming_active
    streaming_active = True  # ✅ Start streaming when WebSocket starts
    camera.start_capture()
    exercise_helper.setup_bicep_curls()

    counter = 0  # Reset counter before starting the exercise

    # ✅ Send countdown to frontend
    for countdown in range(5, 0, -1):
        await websocket.send_json({"event": "display_countdown", "countdown": countdown})
        await asyncio.sleep(1)

    exercise_helper.bicep_curls.timer_instance.start()

    while camera.cap.isOpened():
        ret, frame = camera.read_frame()
        if not ret:
            break

        # ✅ Process frame for exercise tracking
        frame, angle, counter = exercise_helper.perform_bicep_curls(frame)

        # ✅ Convert frame to Base64 for WebSocket (Not MJPEG)
        _, buffer = cv2.imencode(".jpg", frame)
        base64_frame = base64.b64encode(buffer).decode("utf-8")

        remaining_time = exercise_helper.bicep_curls.timer_instance.get_remaining_time()

        # ✅ Send exercise progress to frontend
        await websocket.send_json({
            "event": "update_frame",
            "image": base64_frame,
            "counter": counter,
            "remaining_time": remaining_time
        })

        if remaining_time <= 0:
            await websocket.send_json({"event": "exercise_finished", "counter": counter})
            await websocket.send_json({
                "event": "display_alert",
                "title": "Exercise Finished",
                "text": "You have completed the exercise!",
                "icon": "success"
            })
            break

        await asyncio.sleep(0.1)

    # ✅ Stop streaming when WebSocket stops
    streaming_active = False
    camera.release_capture()
    await websocket.close()