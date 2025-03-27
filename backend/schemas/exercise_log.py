from pydantic import BaseModel
from datetime import datetime

class ExerciseCreate(BaseModel):
    """Schema for logging an exercise."""
    exercise_name: str
    total_reps: int
    calories_burned: float
    duration_minutes: float

class ExerciseResponse(BaseModel):
    """Schema for returning exercise logs."""
    id: int
    user_id: int
    exercise_name: str
    total_reps: int
    calories_burned: float
    duration_minutes: float
    exercise_date: datetime

    class Config:
        from_attributes = True  # ✅ Ensures SQLModel objects are converted properly