from fastapi import APIRouter, WebSocket, Depends
from sqlmodel import Session
from database import get_session
from services.websocket_services import handle_exercise_websocket, check_camera_service

websocket_router = APIRouter()

@websocket_router.get("/system/check_camera")
async def check_camera():
    """Check if camera is available and working."""
    return await check_camera_service()

@websocket_router.websocket("/start_exercise")
async def start_exercise(websocket: WebSocket, session: Session = Depends(get_session)):
    """Handles exercise tracking with WebSockets."""
    await handle_exercise_websocket(websocket, session)