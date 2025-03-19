from pydantic import BaseModel, EmailStr
from datetime import date

class UserCreate(BaseModel):
    """Schema for user registration."""
    name: str
    email: EmailStr
    password: str
    gender: str
    dob: date
    height_cm: float
    weight_kg: float

class LoginRequest(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    """Schema for login response."""
    message: str
    id: int
    name: str