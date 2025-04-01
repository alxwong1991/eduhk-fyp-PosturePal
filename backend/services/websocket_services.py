import asyncio
import base64
import cv2
from fastapi import WebSocket, HTTPException
from sqlmodel import Session
from modules.camera import Camera
from modules.exercise_helper import ExerciseHelper
from config.difficulty_config import DIFFICULTY_LEVELS, DEFAULT_DIFFICULTY
from modules.calorie_tracker import estimate_calories_burned
from services.auth_services import get_user

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

    # ✅ Validate user profile data
    if not user:
        await websocket.send_json({"error": "User not found."})
        print("❌ ERROR: User not found.")
        return None, None, None, True

    required_fields = ["weight_kg", "height_cm", "gender", "dob"]
    missing_fields = [field for field in required_fields if not getattr(user, field, None)]

    if missing_fields:
        await websocket.send_json({
            "error": f"User profile incomplete. Missing: {', '.join(missing_fields)}."
        })
        print(f"❌ ERROR: Missing user profile data: {missing_fields}")
        return None, None, None, True

    print(f"🔍 Using Weight: {user.weight_kg} kg for calorie calculation")

    age = user.calculate_age()
    print(f"🔍 Using Weight: {user.weight_kg} kg and Age: {age} years")

    # ✅ Estimate calories for a single rep (~3 seconds)
    calories_per_rep = estimate_calories_burned(
        weight_kg=user.weight_kg,
        height_cm=user.height_cm,
        age = age,
        gender=user.gender,
        exercise_name=exercise,
        duration_seconds=3  # Estimated duration per rep
    )

    if new_counter > exercise_helper.previous_counter:
        total_calories_burned += calories_per_rep

    exercise_helper.previous_counter = new_counter

    # 📸 Encode frame for transmission
    _, buffer = cv2.imencode(".jpg", frame)
    base64_frame = base64.b64encode(buffer).decode("utf-8")

    response_data = {
        "event": "update_frame",
        "image": base64_frame,
        "counter": new_counter,
        "durationMinutes": duration_minutes,
        "totalCaloriesBurned": round(total_calories_burned, 2)
    }

    # 🧾 Log data without image
    response_data_debug = response_data.copy()
    response_data_debug.pop("image", None)
    print("📊 **Formatted Response Data (Without Image):**")
    print(json.dumps(response_data_debug, indent=4))

    await websocket.send_json(response_data)

    return new_counter, total_calories_burned, time_up, False

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

        if user_id is not None:
            try:
                user_id = int(user_id)  # ✅ Convert to integer
            except ValueError:
                await websocket.send_json({"error": "Invalid user_id format. Must be an integer."})
                return

        user = await get_user(session, user_id)  # ✅ Now `get_user()` returns only `User` or `None`

        if user is None:  # ✅ Handle the case where the user is not found
            print("❌ Error fetching user: User not found")
            await websocket.send_json({"error": "User not found"})
            return

        print(f"✅ User found: {user.name}, ID: {user.id}")

        if user:
            print(f"✅ User found: {user.name}, ID: {user.id}")
        else:
            print("⚠️ No user found, proceeding as guest.")

        await start_exercise_session(websocket, session, camera, exercise_helper, exercise, difficulty, user)

    except Exception as e:
        print(f"❌ WebSocket Error: {e}")
    finally:
        camera.release_capture()
        await websocket.close()