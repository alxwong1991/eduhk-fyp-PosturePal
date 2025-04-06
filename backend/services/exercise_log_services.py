from fastapi import HTTPException
from sqlmodel import select
from models.exercise_log import ExerciseLog
from models.user import User
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession 
import pytz

HKT = pytz.timezone("Asia/Hong_Kong")

async def log_exercise_service(exercise_data, session: AsyncSession, user: User):
    """Log a new exercise for the currently logged-in user."""
    
    if not isinstance(user, User):  # Ensure user is a User object
        raise HTTPException(status_code=401, detail="Invalid user data")

    # Convert datetime to naive format
    hkt_now = datetime.now(pytz.utc).astimezone(HKT).replace(tzinfo=None)

    new_exercise = ExerciseLog(
        user_id=user.id,  # Now user is correctly passed
        exercise_name=exercise_data.exercise_name,
        total_reps=exercise_data.total_reps,
        calories_burned=exercise_data.calories_burned,
        duration_minutes=exercise_data.duration_minutes,
        exercise_date=hkt_now,
    )

    # Ensure user.daily_calories_burned is updated safely
    if user.daily_calories_burned is None:
        user.daily_calories_burned = 0
    user.daily_calories_burned += exercise_data.calories_burned

    session.add(new_exercise)
    await session.commit()
    await session.refresh(new_exercise)

    return new_exercise

async def get_user_exercises_service(user_id: int, session: AsyncSession):
    """Fetch all exercise logs for a user."""
    result = await session.execute(select(ExerciseLog).where(ExerciseLog.user_id == user_id))
    exercises = result.scalars().all()

    if not exercises:
        raise HTTPException(status_code=404, detail="No exercises found")

    return exercises

async def delete_exercise_log_service(log_id: int, session: AsyncSession, user: User):
    """Delete an exercise log if it belongs to the user."""
    log = await session.get(ExerciseLog, log_id) 

    if not log:
        raise HTTPException(status_code=404, detail=f"Exercise log with ID {log_id} not found")

    if log.user_id != user.id:  # Ensure the log belongs to the current user
        raise HTTPException(status_code=403, detail="You are not authorized to delete this log")

    await session.delete(log)  # Delete correctly
    await session.commit()

    return {"message": f"Exercise log with ID {log_id} deleted successfully"}