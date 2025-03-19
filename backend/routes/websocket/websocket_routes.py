import asyncio
import base64
import cv2
from fastapi import APIRouter, WebSocket, HTTPException
from modules.camera import Camera
from modules.exercise_helper import ExerciseHelper
from config.difficulty_config import DIFFICULTY_LEVELS, DEFAULT_DIFFICULTY

websocket_router = APIRouter()

# ✅ Check Camera Endpoint
@websocket_router.get("/system/check_camera")
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
        raise HTTPException(status_code=400, detail=f"Failed to access camera: {str(e)}")


# ✅ WebSocket for Exercise Tracking
@websocket_router.websocket("/start_exercise")
async def start_exercise(websocket: WebSocket):
    """Handles exercise tracking with WebSockets."""
    await websocket.accept()

    camera = Camera()  # ✅ Ensure camera is initialized inside the function
    exercise_helper = ExerciseHelper()

    try:
        camera.start_capture()  # ✅ Start capturing video

        # ✅ Extract parameters from WebSocket query string
        query_params = websocket.query_params
        exercise = query_params.get("exercise")
        difficulty = query_params.get("difficulty", DEFAULT_DIFFICULTY)

        if not exercise:
            await websocket.send_json({"error": "Missing 'exercise' parameter"})
            return

        exercise_helper.setup_exercise(exercise)
        exercise_helper.set_difficulty(exercise, difficulty)

        max_reps = DIFFICULTY_LEVELS.get(exercise, {}).get(difficulty, 10)

        for i in range(5, 0, -1):
            await websocket.send_json({"event": "display_countdown", "countdown": i})
            await asyncio.sleep(1)

        counter = 0
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

        await websocket.send_json({
            "event": "exercise_complete",
            "message": f"Exercise complete! Total reps: {counter}",
            "total_reps": counter
        })

    except Exception as e:
        print(f"WebSocket Error: {e}")
    finally:
        camera.release_capture()  # ✅ Ensure the camera is always released
        await websocket.close()