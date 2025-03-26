# 🚀 PosturePal - AI Exercise Tracker  
This is my final year project at **EDUHK**. **PosturePal** is an **AI-powered exercise tracking application** that uses **computer vision** to count repetitions and monitor form for exercises like **Bicep Curls** and **Squats** in real-time.  

⚠ **❗ Important:** **MediaPipe does *not* support newer Python versions (e.g., Python 3.10+).**  
👉 It is recommended to use **Python 3.8 - 3.10** for compatibility.

## ✨ Features
- ✅ Real-time Exercise Tracking – Uses AI to count repetitions
- ✅ Form Detection – Monitors posture to ensure proper form
- ✅ Webcam Integration – Track workouts via a webcam
- ✅ User-Friendly UI – Simple and intuitive interface
- ✅ Exercises Supported:
  - 🏋️ **Bicep Curls**
  - 🏋️ **Squats**

## 📋 Prerequisites
Before getting started, ensure you have the following installed:

- Python 3.8+
- Node.js 14.x+
- npm 6.x+
- A webcam
- Git
- Docker *(for database setup)*

# 🛠 Quick Start Guide

## 📌 Database Setup (PostgreSQL in Docker) 📌

### To set up a PostgreSQL database using Docker, run the following command:

```env
docker-compose up -d
```

### After running the command, check if the container is running:

```env
docker ps
```

### Stop and Remove the Database (Cleanup)

```env
docker-compose down -v
```

#### ⚠ Warning: This removes the database and all stored data!
#### If you want to keep the data, use:

```env
docker-compose down
```

## 📌 Environment Variables Setup 📌

### Create enviroment variables for both backend and frontend folders

### **Frontend (`.env`)**
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WEBSOCKET_URL=ws://localhost:8000
```

### **Backend (`.env`)**
```env
API_HOST=0.0.0.0
API_PORT=8000
DATABASE_URL=postgresql+asyncpg://posturepal_user:password@localhost:5432/posturepal
FRONTEND_ORIGINS=http://localhost:5173
SECRET_KEY=55d10f0f652c1ddb210895fd5573545a4a449216bdb27d404f309d24db810ee6
```

## 📌 Backend Setup 📌

### Create and activate a virtual environment

### Windows
```sh
python -m venv venv
venv\Scripts\activate
```

### macOS/Linux
```sh
python3 -m venv venv
source venv/bin/activate
```

### git bash
```sh
source venv/Scripts/activate
```

### Install required dependencies
```sh
pip install -r requirements.txt
```

### Apply Database Migrations
```sh
alembic upgrade head
```

### Start the backend server
```sh
uvicorn main:app --reload
```
### If using system-installed Python
```sh
python -m uvicorn main:app --reload
```

## 📌 Additional Backend Commands (Optional) 📌

### Remove Everything in Docker (⚠ Dangerous)
```sh
docker system prune -a -f --volumes
```

### After installing new packages, update requirements.txt:
```sh
pip freeze > requirements.txt
```

### Create a New Migration (When Making Changes)
```sh
alembic revision --autogenerate -m "Added new fields"
```

### Check Database Tables
```sh
alembic current
```

### Rollback Last Migration
```sh
alembic downgrade -1
```

### Reset Database (⚠ Warning: Deletes Data)
```sh
alembic downgrade base
alembic upgrade head
```

## 📌 Frontend Setup 📌

### Install dependencies
```sh
npm install
```

### Start the frontend development server
```sh
npm run dev
```