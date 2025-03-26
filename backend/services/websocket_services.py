import asyncio
import base64
import cv2
from fastapi import WebSocket, HTTPException
from sqlmodel import Session, select
from modules.camera import Camera
from modules.exercise_helper import ExerciseHelper
from config.difficulty_config import DIFFICULTY_LEVELS, DEFAULT_DIFFICULTY
from modules.calorie_tracker import calculate_calories_burned
from models.user import User
from models.exercise_log import ExerciseLog
from datetime import datetime, timezone

async def check_camera_service():
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

async def get_user(session, user_id):
    """Fetch user details from the database."""
    if user_id:
        try:
            user = session.exec(select(User).where(User.id == int(user_id))).first()
            if not user:
                return None, "User not found"
            return user, None
        except ValueError:
            return None, "Invalid user_id format"
    return None, None

async def send_countdown(websocket):
    """Send a countdown before starting the exercise."""
    for i in range(5, 0, -1):
        await websocket.send_json({"event": "display_countdown", "countdown": i})
        await asyncio.sleep(1)

import json  # ✅ Import JSON module for pretty printing

async def process_frame(websocket, exercise_helper, exercise, frame, max_reps, user, total_calories_burned, start_time):
    """Process a frame, track reps, and update calories based on completed reps."""
    try:
        frame, angle, new_counter, time_up = exercise_helper.perform_exercise(exercise, frame, max_reps)
    except Exception as e:
        print(f"❌ Error in perform_exercise: {e}")
        await websocket.send_json({"error": "Failed to process exercise data"})
        return None, None, None, True

    elapsed_time = asyncio.get_event_loop().time() - start_time
    duration_seconds = round(elapsed_time, 2)
    duration_minutes = round(duration_seconds / 60, 2)

    print(f"⏳ Elapsed Time: {duration_seconds} sec ({duration_minutes} min)")

    # ✅ Set default weight if user is not logged in
    weight_kg = 80 if user is None else user.weight_kg

    if weight_kg is None:
        print("❌ ERROR: User weight is missing! Using default 80kg.")
        weight_kg = 80

    print(f"🔍 Using Weight: {weight_kg} kg for calorie calculation")

    # ✅ Track calories ONLY when a rep is completed
    calories_per_rep = calculate_calories_burned(weight_kg, exercise, 3)  # Assume each rep takes ~3s
    if new_counter > exercise_helper.previous_counter:  # ✅ Check if a new rep is completed
        total_calories_burned += calories_per_rep

    # ✅ Update the counter (store last rep count to detect new reps)
    exercise_helper.previous_counter = new_counter  

    _, buffer = cv2.imencode(".jpg", frame)
    base64_frame = base64.b64encode(buffer).decode("utf-8")

    response_data = {
        "event": "update_frame",
        "image": base64_frame,
        "counter": new_counter,
        "durationMinutes": duration_minutes,
        "totalCaloriesBurned": round(total_calories_burned, 2)
    }

    # ✅ Create a copy without the "image" key for debugging
    response_data_debug = response_data.copy()
    response_data_debug.pop("image", None)  # ✅ Remove "image" for logging

    # ✅ Pretty print response (without image)
    print("📊 **Formatted Response Data (Without Image):**")
    print(json.dumps(response_data_debug, indent=4))  # ✅ Clean output

    await websocket.send_json(response_data)

    return new_counter, total_calories_burned, time_up, False

async def save_exercise_log(session, user, exercise, counter, total_calories_burned, duration_seconds):
    """Save the exercise log to the database for logged-in users."""
    new_exercise_log = ExerciseLog(
        user_id=user.id,
        exercise_name=exercise,
        total_reps=counter,
        calories_burned=round(total_calories_burned, 2),
        duration_minutes=round(duration_seconds / 60, 2),  # ✅ Convert seconds to minutes
        exercise_date=datetime.now(timezone.utc),
    )
    user.daily_calories_burned += total_calories_burned
    session.add(new_exercise_log)
    session.commit()

async def start_exercise_session(websocket, session, camera, exercise_helper, exercise, difficulty, user):
    """Handles the exercise session with WebSocket communication."""
    exercise_helper.setup_exercise(exercise)
    exercise_helper.set_difficulty(exercise, difficulty)

    max_reps = DIFFICULTY_LEVELS.get(exercise, {}).get(difficulty, 10)
    total_calories_burned = 0
    start_time = asyncio.get_event_loop().time()

    await send_countdown(websocket)

    counter = 0
    while camera.cap.isOpened():
        ret, frame = camera.read_frame()
        if not ret:
            break

        counter, total_calories_burned, time_up, error_occurred = await process_frame(
            websocket, exercise_helper, exercise, frame, max_reps, user, total_calories_burned, start_time
        )

        if error_occurred:
            break

        if counter >= max_reps or time_up:
            elapsed_time = asyncio.get_event_loop().time() - start_time
            duration_minutes = round(elapsed_time / 60, 2)

            # ✅ Ensure the correct data is sent
            response_data = {
                "event": "exercise_complete",
                "message": "Workout complete!",
                "totalReps": counter,
                "totalCaloriesBurned": round(total_calories_burned, 2),  # ✅ Ensure correct calories
                "durationMinutes": duration_minutes,
                "userId": user.id if user else None
            }

            # ✅ Debugging log
            print("📊 **Final Response Data Sent to Frontend:**")
            print(json.dumps(response_data, indent=4))  # ✅ Ensure correct values are sent

            await websocket.send_json(response_data)
            break

        await asyncio.sleep(0.1)

    if user:
        await save_exercise_log(session, user, exercise, counter, total_calories_burned, elapsed_time)

async def handle_exercise_websocket(websocket: WebSocket, session: Session):
    """Handles exercise tracking with WebSockets."""
    await websocket.accept()
    camera = Camera()
    exercise_helper = ExerciseHelper()

    try:
        camera.start_capture()
        query_string = websocket.scope.get("query_string", "").decode()

        try:
            query_params = dict(param.split("=") for param in query_string.split("&") if "=" in param)
        except Exception:
            query_params = {}

        print(f"🔹 WebSocket Query Params: {query_params}")

        exercise = query_params.get("exercise")
        difficulty = query_params.get("difficulty", DEFAULT_DIFFICULTY)
        user_id = query_params.get("user_id")

        user, error = await get_user(session, user_id)
        if error:
            await websocket.send_json({"error": error})
            return

        await start_exercise_session(websocket, session, camera, exercise_helper, exercise, difficulty, user)

    except Exception as e:
        print(f"WebSocket Error: {e}")
    finally:
        camera.release_capture()
        await websocket.close()