from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from services.video_services import start_streaming_service, stop_streaming_service, generate_frames_service, is_streaming_active_service

video_router = APIRouter()

@video_router.get("/video_feed")
def video_feed():
    """Serve webcam as MJPEG stream."""
    if not is_streaming_active_service():
        return {"message": "Streaming is not active"}

    return StreamingResponse(generate_frames_service(), media_type="multipart/x-mixed-replace; boundary=frame")

@video_router.get("/start_streaming")
def start_streaming():
    return start_streaming_service()

@video_router.get("/stop_streaming")
def stop_streaming():
    return stop_streaming_service()