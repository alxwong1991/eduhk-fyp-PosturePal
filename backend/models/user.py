from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from pydantic import EmailStr
import bcrypt
from datetime import date, datetime
from models.exercise_log import ExerciseLog

class User(SQLModel, table=True):
    """✅ User model with relationship to ExerciseLog."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: EmailStr = Field(unique=True)
    password_hash: str
    gender: str = Field(default="Other")
    dob: date  # ✅ Store Date of Birth
    height_cm: float
    weight_kg: float
    daily_calories_burned: float = Field(default=0)

    # ✅ Use forward reference "ExerciseLog" (string)
    exercises: List["ExerciseLog"] = Relationship(back_populates="user")

    def calculate_age(self) -> int:
        """✅ Dynamically calculate age from stored DOB."""
        today = datetime.today().date()
        age = today.year - self.dob.year - ((today.month, today.day) < (self.dob.month, self.dob.day))
        return age

    def verify_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode(), self.password_hash.encode())

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()