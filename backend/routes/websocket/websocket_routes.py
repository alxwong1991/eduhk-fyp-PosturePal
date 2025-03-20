import asyncio
import base64
import cv2
from fastapi import APIRouter, WebSocket, HTTPException, Depends
from sqlmodel import Session, select
from modules.camera import Camera
from modules.exercise_helper import ExerciseHelper
from config.difficulty_config import DIFFICULTY_LEVELS, DEFAULT_DIFFICULTY
from config.met_values import MET_VALUES
from database import get_session
from models.user import User
from models.exercise_log import ExerciseLog
from modules.calorie_tracker import calculate_calories_burned
from datetime import datetime, timezone

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
async def start_exercise(websocket: WebSocket, session: Session = Depends(get_session)):
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
        user_id = query_params.get("user_id")

        if not exercise or not user_id:
            await websocket.send_json({"error": "Missing 'exercise' or 'user_id' parameter"})
            return
        
        # ✅ Fetch user from database
        user = session.exec(select(User).where(User.id == int(user_id))).first()
        if not User:
            await websocket.send_json({"error": "User not found"})
            return
        
        user_weight = user.weight_kg

        exercise_helper.setup_exercise(exercise)
        exercise_helper.set_difficulty(exercise, difficulty)

        max_reps = DIFFICULTY_LEVELS.get(exercise, {}).get(difficulty, 10)
        total_calories_burned = 0
        start_time = asyncio.get_event_loop().time()

        for i in range(5, 0, -1):
            await websocket.send_json({"event": "display_countdown", "countdown": i})
            await asyncio.sleep(1)

        counter = 0
        while camera.cap.isOpened():
            ret, frame = camera.read_frame()
            if not ret:
                break

            frame, angle, counter, time_up = exercise_helper.perform_exercise(exercise, frame, max_reps)
            
            elapsed_time = asyncio.get_event_loop().time() - start_time # ✅ Track elapsed time
            duration_minutes = elapsed_time / 60 # Convert seconds to minutes

            # ✅ Calculate calories burned dynamically
            calories_burned = calculate_calories_burned(user_weight, exercise, duration_minutes)
            total_calories_burned = calories_burned # ✅ Store latest calorie count

            _, buffer = cv2.imencode(".jpg", frame)
            base64_frame = base64.b64encode(buffer).decode("utf-8")

            await websocket.send_json({
                "event": "update_frame",
                "image": base64_frame,
                "counter": counter,
                "calories_burned": round(total_calories_burned, 2)
            })

            if counter >= max_reps or time_up:
                break  

            await asyncio.sleep(0.1)

        new_exercise_log = ExerciseLog(
            user_id=user.id,
            exercise_name=exercise,
            total_reps=counter,
            calories_burned=round(total_calories_burned, 2),
            duration_minutes=round(duration_minutes, 2),
            exercise_date=datetime.now(timezone.utc),
        )

        user.daily_calories_burned += total_calories_burned
        session.add(new_exercise_log)
        session.commit()

        await websocket.send_json({
            "event": "exercise_complete",
            "message": f"Exercise complete! Total reps: {counter}",
            "total_reps": counter,
            "total_calories_burned": round(total_calories_burned, 2)
        })

    except Exception as e:
        print(f"WebSocket Error: {e}")
    finally:
        camera.release_capture()  # ✅ Ensure the camera is always released
        await websocket.close()