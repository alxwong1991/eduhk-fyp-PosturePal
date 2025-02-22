# 🚀 PosturePal - AI Exercise Tracker  
This is my final year project at **EDUHK**. **PosturePal** is an **AI-powered exercise tracking application** that uses **computer vision** to count repetitions and monitor form for exercises like **Bicep Curls** and **Squats** in real-time.  

⚠ **❗ Important:** **MediaPipe does *not* support newer Python versions (e.g., Python 3.11+).**  
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

Python 3.8+
Node.js 14.x+
npm 6.x+
A webcam
Git

# 🛠 Quick Start Guide

## 📌 Backend Setup 📌

### 1️⃣ Create and activate a virtual environment

### Windows

python -m venv venv
venv\Scripts\activate

### macOS/Linux
python3 -m venv venv

source venv/bin/activate

### 2️⃣ Install required dependencies
pip install -r requirements.txt

### 3️⃣ Start the backend server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

## 📌 Frontend Setup 📌

### 1️⃣ Install dependencies
npm install

### 2️⃣ Start the frontend development server
npm run dev

## 📌 Environment Variables Setup 📌

### **Frontend (`.env`)**
VITE_API_BASE_URL=http://localhost:8000
VITE_WEBSOCKET_URL=ws://localhost:8000

### **Backend (`.env`)**
```env
API_HOST=0.0.0.0
API_PORT=8000
FRONTEND_ORIGINS=http://localhost:5173