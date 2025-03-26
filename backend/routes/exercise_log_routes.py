from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from database import get_session
from schemas.exercise_log import ExerciseCreate, ExerciseResponse
from services.exercise_log_services import log_exercise_service, get_user_exercises_service
from services.auth_services import get_current_user_service

exercise_log_router = APIRouter()

@exercise_log_router.post("/log", response_model=ExerciseResponse)
async def log_exercise(
    exercise_data: ExerciseCreate, 
    session: AsyncSession = Depends(get_session), 
    user_data = Depends(get_current_user_service)  # ✅ Fetch user as a tuple (User, error)
):
    """API Endpoint to log an exercise."""

    # ✅ Ensure user_data is unpacked correctly
    if isinstance(user_data, tuple):  
        user, error = user_data
    else:
        user, error = user_data, None  

    if error:
        raise HTTPException(status_code=401, detail=error)  # ✅ Handle authentication errors

    return await log_exercise_service(exercise_data, session, user)

@exercise_log_router.get("/logs/{user_id}", response_model=list[ExerciseResponse])
def get_user_exercises(user_id: int, session: AsyncSession = Depends(get_session)):
    """Fetch all exercise logs for a user."""
    return get_user_exercises_service(user_id, session)