from pydantic import BaseModel, EmailStr
from datetime import date
from datetime import date, datetime

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

class UserProfileResponse(BaseModel):
    """✅ Schema for returning user profile info."""
    id: int
    name: str
    email: EmailStr
    age: int  # ✅ Ensure age is included in the response
    gender: str
    dob: date
    height_cm: float
    weight_kg: float

    @classmethod
    def from_user(cls, user):
        """✅ Compute age dynamically before returning the response."""
        today = datetime.today().date()
        age = today.year - user.dob.year - ((today.month, today.day) < (user.dob.month, user.dob.day))
        return cls(
            id=user.id,
            name=user.name,
            email=user.email,
            age=age,  # ✅ Age is now calculated dynamically
            gender=user.gender,
            dob=user.dob,
            height_cm=user.height_cm,
            weight_kg=user.weight_kg,
        )