from fastapi import FastAPI
# from routes import users, exercises, feedback

app = FastAPI()

# Include routes
# app.include_router(users.router)
# app.include_router(exercises.router)
# app.include_router(feedback.router)

@app.get("/")
def home():
    return {"message": "Welcome to PosturePal Backend!"}