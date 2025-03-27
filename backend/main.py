import os
import asyncio
from fastapi import FastAPI, Depends
from sqlmodel import Session
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from database import get_session
from contextlib import asynccontextmanager
from routes.auth_routes import auth_router
from routes.exercise_log_routes import exercise_log_router
from routes.video_routes import video_router
from routes.websocket_routes import websocket_router
from utils.reset_daily_calories import reset_daily_calories

# ✅ Load environment variables
load_dotenv(override=True)

API_HOST = os.getenv("API_HOST")
API_PORT = int(os.getenv("API_PORT"))
FRONTEND_ORIGINS = os.getenv("FRONTEND_ORIGINS").split(",")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """✅ Handles startup and shutdown events."""
    print("✅ App is starting...")

    # ✅ Start background task for daily calorie reset
    asyncio.create_task(reset_daily_calories())

    yield  # Wait while the app is running

    print("🛑 App is shutting down...")

# ✅ Initialize FastAPI instance
app = FastAPI(title="PosturePal API", description="Backend for PosturePal", lifespan=lifespan)

# ✅ Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Register API routes
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(exercise_log_router, prefix="/exercise", tags=["Exercise Log"])
app.include_router(video_router, prefix="/video", tags=["Video Streaming"])
app.include_router(websocket_router, prefix="/ws", tags=["WebSockets"])

@app.get("/")
def home():
    """✅ Root endpoint to check if API is running."""
    return {"message": "Welcome to PosturePal Backend!"}

@app.get("/health")
def health_check(session: Session = Depends(get_session)):
    """✅ Simple health check for database connectivity."""
    try:
        session.exec(text("SELECT 1"))  # Simple DB check
        return {"status": "✅ Database connection successful!"}
    except Exception as e:
        return {"status": "❌ Database connection failed!", "error": str(e)}

# ✅ Run the app only when executed directly
if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting FastAPI server...")
    uvicorn.run(app, host=API_HOST, port=API_PORT)