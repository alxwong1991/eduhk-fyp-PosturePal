from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from models.user import User
from database import get_session
from schemas.exercise_log import ExerciseCreate, ExerciseResponse
from services.exercise_log_services import log_exercise_service, get_user_exercises_service
from services.auth_services import get_current_user_service

exercise_log_router = APIRouter()

@exercise_log_router.post("/log", response_model=ExerciseResponse)
async def log_exercise(
    exercise_data: ExerciseCreate, 
    session: AsyncSession = Depends(get_session), 
    user: User = Depends(get_current_user_service)  # ✅ Now directly returns `User`
):
    """API Endpoint to log an exercise."""
    return await log_exercise_service(exercise_data, session, user)  # ✅ Use `user` directly

@exercise_log_router.get("/logs/{user_id}", response_model=list[ExerciseResponse])
async def get_user_exercises(user_id: int, session: AsyncSession = Depends(get_session)):
    """Fetch all exercise logs for a user."""
    return await get_user_exercises_service(user_id, session)