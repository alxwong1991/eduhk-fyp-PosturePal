import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.video import video_router
from routes.websocket import websocket_router
from dotenv import load_dotenv

load_dotenv(override=True)

API_HOST = os.getenv("API_HOST")
API_PORT = int(os.getenv("API_PORT"))
FRONTEND_ORIGINS = os.getenv("FRONTEND_ORIGINS").split(",")

app = FastAPI(title="PosturePal API", description="Backend for PosturePal")

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(video_router)
app.include_router(websocket_router)

@app.get("/")
def home():
    return {"message": "Welcome to PosturePal Backend!"}

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting FastAPI server...")
    uvicorn.run(app, host=API_HOST, port=API_PORT)