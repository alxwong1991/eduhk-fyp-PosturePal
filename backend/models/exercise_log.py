from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional

class ExerciseLog(SQLModel, table=True):
    """✅ Table for storing user exercise logs."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")  # ✅ Links to User table
    exercise_name: str
    total_reps: int
    calories_burned: float
    duration_minutes: float
    exercise_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # ✅ Use forward reference "User" (string) to prevent circular import
    user: Optional["User"] = Relationship(back_populates="exercise_logs")  # ✅ Fixed relationship name