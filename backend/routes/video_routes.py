from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from services.video_services import start_streaming_service, stop_streaming_service, generate_frames_service, is_streaming_active_service

video_router = APIRouter()

@video_router.get("/video_feed")
async def video_feed():
    """Serve webcam as MJPEG stream asynchronously."""
    if not is_streaming_active_service():
        return {"message": "Streaming is not active"}

    return StreamingResponse(generate_frames_service(), media_type="multipart/x-mixed-replace; boundary=frame")

@video_router.get("/start_streaming")
async def start_streaming():
    """Start video streaming asynchronously."""
    return await start_streaming_service()

@video_router.get("/stop_streaming")
async def stop_streaming():
    """Stop video streaming asynchronously."""
    return await stop_streaming_service()