from fastapi import APIRouter, Depends, HTTPException
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
async def get_profile(user_data=Depends(get_current_user_service)):
    """Retrieve the profile of the logged-in user."""

    if isinstance(user_data, tuple):  # ✅ Unpack the tuple correctly
        user, error = user_data
    else:
        user, error = user_data, None  

    if error:
        raise HTTPException(status_code=401, detail=error)  # ✅ Handle authentication errors

    return UserProfileResponse.from_user(user)  # ✅ Now `user` is correctly a `User` object

@auth_router.post("/logout")
async def logout_user(user_data=Depends(get_current_user_service)):
    """Logs out the user by clearing session/token (if applicable)."""

    if isinstance(user_data, tuple):  # ✅ Ensure correct unpacking
        user, error = user_data
    else:
        user, error = user_data, None  

    if error:
        raise HTTPException(status_code=401, detail=error)  # ✅ Handle authentication errors

    return await logout_user_service(user)  # ✅ Now `user` is correctly a `User` object