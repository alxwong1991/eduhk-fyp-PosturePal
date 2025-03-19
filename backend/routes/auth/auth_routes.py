from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models.user import User
from schemas.user import UserCreate, LoginRequest, LoginResponse
from utils.security import hash_password, verify_password
import re
import logging

auth_router = APIRouter()

# Email validation regex
EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

@auth_router.post("/register")
def register_user(user_data: UserCreate, session: Session = Depends(get_session)):
    """✅ Register a new user."""

    # Validate email format
    if not re.match(EMAIL_REGEX, user_data.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    # Check if email exists
    existing_user = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Hash password
    hashed_password = hash_password(user_data.password)

    # Create new user
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password,
        gender=user_data.gender,
        dob=user_data.dob,
        height_cm=user_data.height_cm,
        weight_kg=user_data.weight_kg,
    )

    # Save user
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    return {"message": "User registered successfully"}

@auth_router.post("/login", response_model=LoginResponse)
def login_user(login_data: LoginRequest, session: Session = Depends(get_session)):
    """✅ Log in a user and return basic details."""

    user = session.exec(select(User).where(User.email == login_data.email)).first()
    
    if not user:
        logging.error(f"Login failed: No user found with email {login_data.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(login_data.password, user.password_hash):
        logging.error(f"Login failed: Incorrect password for {login_data.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "id": user.id,
        "name": user.name
        }