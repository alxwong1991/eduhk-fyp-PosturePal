from fastapi import APIRouter, WebSocket
from exercises.bicep_curls import BicepCurls
import cv2

router = APIRouter()
exercise = BicepCurls()

@router.websocket("/ws/bicep_curls")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    cap = cv2.VideoCapture(1)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame, counter = exercise.perform_exercise(frame)
        await websocket.send_json({"counter": counter})

    cap.release()