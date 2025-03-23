from fastapi import HTTPException
from sqlmodel import Session, select
from models.exercise_log import ExerciseLog
from models.user import User
from datetime import datetime, timezone

def log_exercise_service(exercise_data, session: Session):
    """Log a new exercise for a user."""
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

    user.daily_calories_burned += exercise_data.calories_burned
    session.add(new_exercise)
    session.commit()
    session.refresh(new_exercise)

    return new_exercise

def get_user_exercises_service(user_id: int, session: Session):
    """Fetch all exercise logs for a user."""
    exercises = session.exec(select(ExerciseLog).where(ExerciseLog.user_id == user_id)).all()
    if not exercises:
        raise HTTPException(status_code=404, detail="No exercises found")

    return exercises