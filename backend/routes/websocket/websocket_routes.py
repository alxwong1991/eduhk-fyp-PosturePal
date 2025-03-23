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
import pdb

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
    
@websocket_router.websocket("/start_exercise")
async def start_exercise(websocket: WebSocket, session: Session = Depends(get_session)):
    """Handles exercise tracking with WebSockets."""
    await websocket.accept()

    camera = Camera()
    exercise_helper = ExerciseHelper()

    try:
        camera.start_capture()
        query_string = websocket.scope["query_string"].decode()
        query_params = dict(param.split("=") for param in query_string.split("&") if "=" in param)

        print(f"🔹 WebSocket Query Params: {query_params}")

        exercise = query_params.get("exercise")
        difficulty = query_params.get("difficulty", DEFAULT_DIFFICULTY)
        user_id = query_params.get("user_id")

        user = None
        user_weight = None  # ✅ Default to None for guests (no calorie tracking)

        if user_id:
            try:
                user = session.exec(select(User).where(User.id == int(user_id))).first()
                if not user:
                    await websocket.send_json({"error": "User not found"})
                    return
                user_weight = user.weight_kg  # ✅ Only logged-in users track calories
            except ValueError:
                await websocket.send_json({"error": "Invalid user_id format"})
                return

        # ✅ Setup Exercise
        exercise_helper.setup_exercise(exercise)
        exercise_helper.set_difficulty(exercise, difficulty)

        max_reps = DIFFICULTY_LEVELS.get(exercise, {}).get(difficulty, 10)
        total_calories_burned = 0
        start_time = asyncio.get_event_loop().time()

        # ✅ Countdown Before Starting
        for i in range(5, 0, -1):
            await websocket.send_json({"event": "display_countdown", "countdown": i})
            await asyncio.sleep(1)

        counter = 0

        while camera.cap.isOpened():
            ret, frame = camera.read_frame()
            if not ret:
                break

            try:
                frame, angle, counter, time_up = exercise_helper.perform_exercise(exercise, frame, max_reps)
            except Exception as e:
                print(f"❌ Error in perform_exercise: {e}")
                await websocket.send_json({"error": "Failed to process exercise data"})
                break

            elapsed_time = asyncio.get_event_loop().time() - start_time
            duration_minutes = elapsed_time / 60
            calories_burned = 0

            if user:  # ✅ Only calculate calories for logged-in users
                calories_burned = calculate_calories_burned(user_weight, exercise, duration_minutes)
                total_calories_burned = calories_burned

            _, buffer = cv2.imencode(".jpg", frame)
            base64_frame = base64.b64encode(buffer).decode("utf-8")

            # ✅ Send different responses for logged-in users vs guests
            response_data = {
                "event": "update_frame",
                "image": base64_frame,
                "counter": counter
            }

            if user:  # ✅ Add calories only for logged-in users
                response_data["calories_burned"] = round(total_calories_burned, 2)

            await websocket.send_json(response_data)

            if counter >= max_reps or time_up:
                await websocket.send_json({
                    "event": "exercise_complete", 
                    "message": "Workout complete!", 
                    "total_reps": counter
                    })
                break  

            await asyncio.sleep(0.1)

        # ✅ Final Exercise Completion Message
        completion_data = {
            "event": "exercise_complete",
            "message": f"Exercise complete! Total reps: {counter}",
            "total_reps": counter,
            "user_id": user.id if user else None  # ✅ Only send user_id if logged in
        }

        if user:  # ✅ Only logged-in users track calories
            completion_data["total_calories_burned"] = round(total_calories_burned, 2)

        await websocket.send_json(completion_data)

        # ✅ Only Save Log If User Is Logged In
        if user:
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

    except Exception as e:
        print(f"WebSocket Error: {e}")
    finally:
        camera.release_capture()
        await websocket.close()