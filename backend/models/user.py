from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from pydantic import EmailStr
from datetime import date, datetime
from utils.security import verify_password  # Import from security.py

class User(SQLModel, table=True):
    """User model with relationship to ExerciseLog."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: EmailStr = Field(unique=True)
    password_hash: str
    gender: str = Field(default="Other")
    dob: date  # Store Date of Birth
    height_cm: float
    weight_kg: float
    daily_calories_burned: float = Field(default=0)

    # Use forward reference "ExerciseLog" (string) to prevent circular import
    exercise_logs: List["ExerciseLog"] = Relationship(back_populates="user")

    def calculate_age(self) -> int:
        """Dynamically calculate age from stored DOB."""
        today = datetime.today().date()
        age = today.year - self.dob.year - ((today.month, today.day) < (self.dob.month, self.dob.day))
        return age

    def check_password(self, password: str) -> bool:
        """Verify hashed password (renamed to avoid confusion)."""
        return verify_password(password, self.password_hash)