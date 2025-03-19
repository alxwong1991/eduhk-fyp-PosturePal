import cv2
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from modules.camera import Camera

video_router = APIRouter()
camera = Camera()
streaming_active = False  # ✅ Streaming state

def generate_frames():
    """Continuously capture frames and serve as MJPEG stream."""
    global streaming_active
    camera.start_capture()
    
    while streaming_active:
        ret, frame = camera.read_frame()
        if not ret:
            break

        _, buffer = cv2.imencode('.jpg', frame)
        yield (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n'
        )

    camera.release_capture()

@video_router.get("/video_feed")
def video_feed():
    """Serve webcam as MJPEG stream."""
    global streaming_active
    if not streaming_active:
        return {"message": "Streaming is not active"}
    
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@video_router.get("/start_streaming")
def start_streaming():
    global streaming_active
    streaming_active = True
    return {"message": "Streaming started"}

@video_router.get("/stop_streaming")
def stop_streaming():
    global streaming_active
    streaming_active = False
    return {"message": "Streaming stopped"}