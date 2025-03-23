from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session
from schemas.exercise_log import ExerciseCreate, ExerciseResponse
from services.exercise_log_services import log_exercise_service, get_user_exercises_service

exercise_log_router = APIRouter()

@exercise_log_router.post("/log", response_model=ExerciseResponse)
def log_exercise(exercise_data: ExerciseCreate, session: Session = Depends(get_session)):
    return log_exercise_service(exercise_data, session)

@exercise_log_router.get("/logs/{user_id}", response_model=list[ExerciseResponse])
def get_user_exercises(user_id: int, session: Session = Depends(get_session)):
    return get_user_exercises_service(user_id, session)