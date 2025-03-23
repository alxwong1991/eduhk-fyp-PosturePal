from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from schemas.user import UserCreate, LoginRequest, UserProfileResponse
from services.auth_services import register_user_service, login_user_service, get_current_user_service

auth_router = APIRouter()

@auth_router.post("/register")
def register_user(user_data: UserCreate, session: Session = Depends(get_session)):
    return register_user_service(user_data, session)

@auth_router.post("/login")
def login_user(login_data: LoginRequest, session: Session = Depends(get_session)):
    return login_user_service(login_data, session)

@auth_router.get("/profile", response_model=UserProfileResponse)
def get_profile(user=Depends(get_current_user_service)):
    return UserProfileResponse.from_user(user) 