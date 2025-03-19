import asyncio
import base64
import cv2
from fastapi import APIRouter, WebSocket, Query
from modules.camera import Camera
from modules.exercise_helper import ExerciseHelper
from fastapi import HTTPException
from config.difficulty_config import DIFFICULTY_LEVELS, DEFAULT_DIFFICULTY

websocket_router = APIRouter()
camera = Camera()
exercise_helper = ExerciseHelper()

# ✅ Check Camera
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
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to access camera")


# ✅ Dynamic WebSocket for Any Exercise
@websocket_router.websocket("/ws/start_exercise")
async def start_exercise(websocket: WebSocket, exercise: str, difficulty: str = Query(DEFAULT_DIFFICULTY)):
    """✅ Handles all exercises dynamically."""
    await websocket.accept()
    camera.start_capture()

    try:
        exercise_helper.setup_exercise(exercise)  # ✅ Setup dynamically
        exercise_helper.set_difficulty(exercise, difficulty)  # ✅ Set difficulty
    except ValueError as e:
        await websocket.send_json({"error": str(e)})
        await websocket.close()
        return

    max_reps = DIFFICULTY_LEVELS.get(exercise, {}).get(difficulty, 10)  # ✅ Get reps dynamically

    for i in range(5, 0, -1):
        await websocket.send_json({"event": "display_countdown", "countdown": i})
        await asyncio.sleep(1)

    while camera.cap.isOpened():
        ret, frame = camera.read_frame()
        if not ret:
            break

        frame, angle, counter, time_up = exercise_helper.perform_exercise(exercise, frame, max_reps)

        _, buffer = cv2.imencode(".jpg", frame)
        base64_frame = base64.b64encode(buffer).decode("utf-8")

        await websocket.send_json({
            "event": "update_frame",
            "image": base64_frame,
            "counter": counter
        })

        if counter >= max_reps or time_up:
            break  

        await asyncio.sleep(0.1)

    camera.release_capture()

    await websocket.send_json({
        "event": "exercise_complete",
        "message": f"Exercise complete! Total reps: {counter}",
        "total_reps": counter
    })

    await websocket.close()