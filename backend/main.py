import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.video import video_router
from routes.websocket import websocket_router
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv(override=True)

# ✅ Environment Variables with Defaults
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000") or 8000)  # Default: 8000
FRONTEND_ORIGINS = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173").split(",")

# ✅ Initialize FastAPI App
app = FastAPI(title="PosturePal API", description="Backend for PosturePal")

# ✅ CORS Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include API Routes
app.include_router(video_router)
app.include_router(websocket_router)

@app.get("/")
def home():
    """Root endpoint."""
    return {"message": "Welcome to PosturePal Backend!"}

# ✅ Run FastAPI with environment variables
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=API_HOST, port=API_PORT)