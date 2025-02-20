import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.video import video_router
from routes.websocket import websocket_router
from dotenv import load_dotenv

# ✅ Load environment variables safely
load_dotenv(override=True)

# ✅ Ensure .env is loaded
if not os.getenv("API_HOST"):
    print("⚠️ Warning: .env file not loaded! Check if it exists.")

# ✅ Get environment variables
API_HOST = os.getenv("API_HOST", "0.0.0.0")

# ✅ Handle invalid API_PORT values
try:
    API_PORT = int(os.getenv("API_PORT", "8000"))  # Default: 8000
except ValueError:
    API_PORT = 8000  # Fallback if invalid

# ✅ Support multiple frontend origins
FRONTEND_ORIGINS = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173")
allowed_origins = FRONTEND_ORIGINS.split(",")

app = FastAPI()

# ✅ CORS Middleware for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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

# ✅ Run FastAPI with environment variables
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=API_HOST, port=API_PORT)