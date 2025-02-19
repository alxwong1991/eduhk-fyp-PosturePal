from fastapi import FastAPI
from routes import exercises, websocket

app = FastAPI()

# Include routers
app.include_router(exercises.router)
app.include_router(websocket.router)

@app.get("/")
def home():
    return {"message": "Welcome to PosturePal Backend!"}