from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session
from models.user import User, hash_password
from pydantic import BaseModel
import re
import logging

auth_router = APIRouter()

# Email validation regex
EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

@auth_router.post("/register")
def register_user(user_data: User, session: Session = Depends(get_session)):
    # Validate email format
    if not re.match(EMAIL_REGEX, user_data.email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    # Check if email exists
    existing_user_email = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Hash password
    user_data.password_hash = hash_password(user_data.password_hash)

    # Save user
    session.add(user_data)
    session.commit()
    session.refresh(user_data)

    return {"message": "User registered successfully"}

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    message: str
    name: str

@auth_router.post("/login", response_model=LoginResponse)
def login_user(login_data: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == login_data.email)).first()
    
    if not user:
        logging.error(f"Login failed: No user found with email {login_data.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not user.verify_password(login_data.password):
        logging.error(f"Login failed: Incorrect password for {login_data.email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful", "name": user.name}