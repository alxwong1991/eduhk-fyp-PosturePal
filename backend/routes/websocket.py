import asyncio
import base64
from fastapi import APIRouter, WebSocket
from modules.camera import Camera
from exercises.bicep_curls import BicepCurls

websocket_router = APIRouter()
camera = Camera()
bicep_curls = BicepCurls()

@websocket_router.websocket("/ws/start_bicep_curls")
async def start_bicep_curls(websocket: WebSocket):
    await websocket.accept()
    camera.start_capture()
    bicep_curls.reset_counter()

    for i in range(5, 0, -1):
        await websocket.send_json({"event": "display_countdown", "countdown": i})
        await asyncio.sleep(1)

    while camera.cap.isOpened():
        ret, frame = camera.read_frame()
        if not ret:
            break

        frame, counter = bicep_curls.process_frame(frame)
        _, buffer = cv2.imencode(".jpg", frame)
        base64_frame = base64.b64encode(buffer).decode("utf-8")

        await websocket.send_json({"event": "update_frame", "image": base64_frame, "counter": counter})
        await asyncio.sleep(0.1)

    camera.release_capture()
    await websocket.close()