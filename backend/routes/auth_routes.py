from fastapi import APIRouter, Depends
from database import get_session
from schemas.user import UserCreate, LoginRequest, UserProfileResponse
from services.auth_services import register_user_service, login_user_service, get_current_user_service, logout_user_service
from sqlalchemy.ext.asyncio import AsyncSession

auth_router = APIRouter()

@auth_router.post("/register")
async def register_user(user_data: UserCreate, session: AsyncSession = Depends(get_session)):
    return await register_user_service(user_data, session) 

@auth_router.post("/login")
async def login_user(login_data: LoginRequest, session: AsyncSession = Depends(get_session)):
    return await login_user_service(login_data, session) 

@auth_router.get("/profile", response_model=UserProfileResponse)
async def get_profile(user=Depends(get_current_user_service)):
    return UserProfileResponse.from_user(user) 

@auth_router.post("/logout")
async def logout_user(user=Depends(get_current_user_service)):
    return await logout_user_service(user)