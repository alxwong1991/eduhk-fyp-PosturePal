from fastapi import APIRouter
from routes.auth.auth_routes import auth_router
from routes.exercises.exercise_routes import exercise_router
from routes.video.video_routes import video_router
from routes.websocket.websocket_routes import websocket_router

router = APIRouter()

router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
router.include_router(exercise_router, prefix="/exercises", tags=["Exercises"])
router.include_router(video_router, prefix="/video", tags=["Video Streaming"])
router.include_router(websocket_router, prefix="/ws", tags=["WebSocket"])

__all__ = ["router"]