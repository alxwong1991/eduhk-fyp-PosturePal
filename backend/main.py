import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.video import video_router
from routes.websocket import websocket_router
from dotenv import load_dotenv

# # ✅ Explicitly load `.env` from `config/`
# ENV_PATH = os.path.join(os.getcwd(), "config", ".env")
# load_dotenv(dotenv_path=ENV_PATH, override=True)

# # ✅ Retrieve Environment Variables with Safe Defaults
# API_HOST = os.getenv("API_HOST", "0.0.0.0")
# API_PORT = os.getenv("API_PORT", "8000")

# # ✅ Ensure API_PORT is an integer
# try:
#     API_PORT = int(API_PORT)
# except ValueError:
#     raise ValueError(f"Invalid API_PORT value: {API_PORT}. It must be an integer.")

# FRONTEND_ORIGINS = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173").split(",")

# ✅ Explicitly load `.env` from `config/`
ENV_PATH = os.path.join(os.getcwd(), "config", ".env")
load_dotenv(dotenv_path=ENV_PATH, override=True)

def get_env_var(name):
    """Retrieve an environment variable and raise an error if missing."""
    value = os.getenv(name)
    if value is None:
        raise ValueError(f"Missing required environment variable: {name}")
    return value

# ❌ No Fallbacks - Enforce `.env` Variables
API_HOST = get_env_var("API_HOST")
API_PORT = int(get_env_var("API_PORT"))  # Ensure it's an integer
FRONTEND_ORIGINS = get_env_var("FRONTEND_ORIGINS").split(",")

print(f"✅ Loaded API_HOST={API_HOST}, API_PORT={API_PORT}")

# ✅ Initialize FastAPI App
app = FastAPI(
    title="PosturePal API", 
    description="Backend for PosturePal"
)

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