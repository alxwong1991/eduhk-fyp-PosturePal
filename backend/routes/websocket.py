import asyncio
import base64
import cv2
from fastapi import APIRouter, WebSocket
from modules.camera import Camera
from exercises.bicep_curls import BicepCurls
from exercises.squats import Squats
from fastapi import HTTPException

websocket_router = APIRouter()
camera = Camera()
bicep_curls = BicepCurls()


# Check Camera
@websocket_router.get("/check_camera")
async def check_camera():
    """Check if camera is available and working."""
    try:
        test_camera = Camera()
        test_camera.start_capture()
        ret, frame = test_camera.read_frame()
        test_camera.release_capture()
        
        if not ret or frame is None:
            raise HTTPException(status_code=400, detail="Camera not working")
            
        return {"status": "ok", "message": "Camera is working"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Failed to access camera")

# Bicep Curls
@websocket_router.websocket("/ws/start_bicep_curls")
async def start_bicep_curls(websocket: WebSocket):
    """Handle WebSocket connection for bicep curl tracking."""
    await websocket.accept()
    camera.start_capture()
    
    bicep_curls.reset_counter()  # ✅ Reset counter and start timer

    # ✅ Warm up the camera (Capture a few frames before countdown)
    for _ in range(10):  # Capture 10 frames to warm up the camera
        ret, _ = camera.read_frame()
        if not ret:
            break
        await asyncio.sleep(0.05)  # Small delay for the camera to stabilize

    # ✅ Countdown before starting
    for i in range(5, 0, -1):
        await websocket.send_json({"event": "display_countdown", "countdown": i})
        await asyncio.sleep(1)

    while camera.cap.isOpened():
        ret, frame = camera.read_frame()
        if not ret:
            break

        frame, angle, counter, time_up = bicep_curls.perform_exercise(frame)  # ✅ Get `time_up` flag
        _, buffer = cv2.imencode(".jpg", frame)
        base64_frame = base64.b64encode(buffer).decode("utf-8")

        remaining_time = bicep_curls.timer_instance.get_remaining_time()

        await websocket.send_json({
            "event": "update_frame",
            "image": base64_frame,
            "counter": counter,
            "remaining_time": remaining_time
        })

        if time_up:
            break  # ✅ Stop the loop when time is up

        await asyncio.sleep(0.1)

    camera.release_capture()

    # ✅ Send final result before closing WebSocket
    await websocket.send_json({
        "event": "exercise_complete",
        "message": f"Exercise complete! Total reps: {bicep_curls.counter}",
        "total_reps": bicep_curls.counter
    })

    await websocket.close()

# Squats
@websocket_router.websocket("/ws/start_squats")
async def start_squats(websocket: WebSocket):
    """Handle WebSocket connection for squats tracking."""
    await websocket.accept()
    camera.start_capture()
    
    squats = Squats()  # Create instance of Squats class
    squats.reset_counter()

    # Warm up the camera
    for _ in range(10):
        ret, _ = camera.read_frame()
        if not ret:
            break
        await asyncio.sleep(0.05)

    while camera.cap.isOpened():
        ret, frame = camera.read_frame()
        if not ret:
            break

        frame, angle, counter, time_up = squats.perform_exercise(frame)
        _, buffer = cv2.imencode(".jpg", frame)
        base64_frame = base64.b64encode(buffer).decode("utf-8")

        remaining_time = squats.timer_instance.get_remaining_time()

        await websocket.send_json({
            "event": "update_frame",
            "image": base64_frame,
            "counter": counter,
            "remaining_time": remaining_time
        })

        if time_up:
            break

        await asyncio.sleep(0.1)

    camera.release_capture()

    await websocket.send_json({
        "event": "exercise_complete",
        "message": f"Exercise complete! Total reps: {squats.counter}",
        "total_reps": squats.counter
    })

    await websocket.close()