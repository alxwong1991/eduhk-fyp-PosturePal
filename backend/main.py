import os
from fastapi import FastAPI, Depends
from sqlmodel import Session
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
from routes.video import video_router
from routes.websocket import websocket_router
from dotenv import load_dotenv
from database import get_session
from contextlib import asynccontextmanager
from routes.auth import auth_router
from routes.exercise_log import exercise_router


load_dotenv(override=True)

API_HOST = os.getenv("API_HOST")
API_PORT = int(os.getenv("API_PORT"))
FRONTEND_ORIGINS = os.getenv("FRONTEND_ORIGINS").split(",")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("✅ App is starting...")
    yield
    print("🛑 App is shutting down...")

# ✅ Keep only this FastAPI instance
app = FastAPI(title="PosturePal API", description="Backend for PosturePal", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(video_router)
app.include_router(websocket_router)
app.include_router(auth_router, prefix="/auth")
app.include_router(exercise_router, prefix="/exercise", tags=["Exercise"])

@app.get("/")
def home():
    return {"message": "Welcome to PosturePal Backend!"}

@app.get("/health")
def health_check(session: Session = Depends(get_session)):
    try:
        session.exec(text("SELECT 1"))  # Simple DB check
        return {"status": "✅ Database connection successful!"}
    except Exception as e:
        return {"status": "❌ Database connection failed!", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting FastAPI server...")
    uvicorn.run(app, host=API_HOST, port=API_PORT)