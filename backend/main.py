from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.video import video_router
from routes.websocket import websocket_router

app = FastAPI()

# ✅ CORS Middleware for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include Modular Routes
app.include_router(video_router)
app.include_router(websocket_router)

@app.get("/")
def home():
    return {"message": "Welcome to PosturePal Backend!"}