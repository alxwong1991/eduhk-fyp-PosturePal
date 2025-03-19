from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models.user import User
from schemas.user import UserCreate, LoginRequest, UserProfileResponse
from utils.security import hash_password, verify_password, create_access_token, verify_access_token
from fastapi.security import OAuth2PasswordBearer
import re

auth_router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Email validation regex
EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

@auth_router.post("/register")
def register_user(user_data: UserCreate, session: Session = Depends(get_session)):
    """✅ Register a new user with hashed password."""
    if not re.match(EMAIL_REGEX, user_data.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = hash_password(user_data.password)  # ✅ Hash password before storing

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,  # ✅ Store hashed password
        gender=user_data.gender,
        dob=user_data.dob,
        height_cm=user_data.height_cm,
        weight_kg=user_data.weight_kg,
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User registered successfully"}

@auth_router.post("/login")
def login_user(login_data: LoginRequest, session: Session = Depends(get_session)):
    """✅ Log in and return a JWT token after verifying hashed password."""
    
    user = session.exec(select(User).where(User.email == login_data.email)).first()
    if not user or not verify_password(login_data.password, user.password_hash):  # ✅ Verify hashed password
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"user_id": user.id, "email": user.email})  # ✅ Generate JWT token
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    """✅ Get current logged-in user from JWT token."""
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user = session.exec(select(User).where(User.email == payload["email"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user

@auth_router.get("/profile", response_model=UserProfileResponse)
def get_profile(user: User = Depends(get_current_user)):
    """✅ Fetch the logged-in user's profile (Protected Route)."""
    return UserProfileResponse.from_user(user)

@auth_router.post("/logout")
def logout_user():
    """✅ Logout by instructing the frontend to delete the JWT token."""
    return {"message": "Logged out successfully. Please remove the token from localStorage."}