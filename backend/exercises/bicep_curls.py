from exercises.base_exercise import BaseExercise
from modules.camera import Camera
import mediapipe as mp
import numpy as np
import cv2

class BicepCurls(BaseExercise):
    def __init__(self):
        super().__init__()
        self.pose = mp.solutions.pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

    def perform_exercise(self, frame):
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        if results.pose_landmarks:
            shoulder = [results.pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.LEFT_SHOULDER].x, 
                        results.pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.LEFT_SHOULDER].y]
            elbow = [results.pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.LEFT_ELBOW].x, 
                     results.pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.LEFT_ELBOW].y]
            wrist = [results.pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.LEFT_WRIST].x, 
                     results.pose_landmarks.landmark[mp.solutions.pose.PoseLandmark.LEFT_WRIST].y]

            angle = self.calculate_angle(shoulder, elbow, wrist)

            if angle > 160:
                self.stage = "down"
            if angle < 30 and self.stage == "down":
                self.stage = "up"
                self.counter += 1

            remaining_time = self.timer.get_remaining_time()
            image = self.ui_renderer.render_status_box(image, self.counter, self.stage, remaining_time)

        return image, self.counter