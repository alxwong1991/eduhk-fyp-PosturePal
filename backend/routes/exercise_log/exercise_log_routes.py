from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models.exercise_log import ExerciseLog
from models.user import User
from schemas.exercise_log import ExerciseCreate, ExerciseResponse
from datetime import datetime, timezone

exercise_log_router = APIRouter()

@exercise_log_router.post("/log", response_model=ExerciseResponse)
def log_exercise(exercise_data: ExerciseCreate, session: Session = Depends(get_session)):
    """✅ Log a new exercise for a user."""
    
    user = session.exec(select(User).where(User.id == exercise_data.user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_exercise = ExerciseLog(
        user_id=exercise_data.user_id,
        exercise_name=exercise_data.exercise_name,
        total_reps=exercise_data.total_reps,
        calories_burned=exercise_data.calories_burned,
        duration_minutes=exercise_data.duration_minutes,
        exercise_date=datetime.now(timezone.utc),
    )

    user.daily_calories_burned += exercise_data.calories_burned  # ✅ Update daily burned calories

    session.add(new_exercise)
    session.commit()
    session.refresh(new_exercise)

    return new_exercise

@exercise_log_router.get("/logs/{user_id}", response_model=list[ExerciseResponse])
def get_user_exercises(user_id: int, session: Session = Depends(get_session)):
    """✅ Fetch all exercise logs for a user."""
    
    exercises = session.exec(select(ExerciseLog).where(ExerciseLog.user_id == user_id)).all()
    if not exercises:
        raise HTTPException(status_code=404, detail="No exercises found")

    return exercises