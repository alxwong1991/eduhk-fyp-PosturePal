import cv2
from modules.camera import Camera

camera = Camera()
streaming_active = False  # ✅ Streaming state

def generate_frames_service():
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

def start_streaming_service():
    """Start video streaming."""
    global streaming_active
    streaming_active = True
    return {"message": "Streaming started"}

def stop_streaming_service():
    """Stop video streaming."""
    global streaming_active
    streaming_active = False
    return {"message": "Streaming stopped"}

def is_streaming_active_service():
    """Check if streaming is active."""
    global streaming_active
    return streaming_active