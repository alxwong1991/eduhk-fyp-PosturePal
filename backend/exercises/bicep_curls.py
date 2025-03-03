import numpy as np
import cv2
from mediapipe.python.solutions import drawing_utils as mp_drawing
from mediapipe.python.solutions import pose as mp_pose
from modules.countdown_timer import CountdownTimer
from modules.ui_renderer import UIRenderer
from config.difficulty_config import DIFFICULTY_LEVELS, DEFAULT_DIFFICULTY

class BicepCurls:
    def __init__(self):
        """Initialize Bicep Curls tracking."""
        self.counter = 0
        self.stage = None
        self.pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
        self.max_reps = DIFFICULTY_LEVELS.get("bicep_curls", {}).get(DEFAULT_DIFFICULTY, 10)  

        # ✅ Countdown timer (30 seconds)
        self.timer = 30
        self.timer_instance = CountdownTimer(self.timer)
        self.timer_started = False

        self.ui_renderer = UIRenderer()
        self.feedback_message = ""  # ✅ Stores feedback message

    def set_difficulty(self, difficulty):
        """✅ Dynamically update max reps based on difficulty."""
        self.max_reps = DIFFICULTY_LEVELS["bicep_curls"].get(difficulty, self.max_reps)

    def reset_counter(self):
        """✅ Reset counter and restart the timer."""
        self.counter = 0
        self.stage = None
        self.timer_started = False  # ✅ Reset timer flag

    def calculate_angle(self, a, b, c):
        """Calculate the angle between three points."""
        a, b, c = np.array(a), np.array(b), np.array(c)

        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)

        return angle if angle <= 180.0 else 360 - angle

    def detect(self, frame):
        """Detects pose landmarks from an image frame."""
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False

        results = self.pose.process(image)

        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        return image, results.pose_landmarks if results.pose_landmarks else None

    def update(self, angle):
        """Update the exercise counter based on detected angle."""
        if angle > 160:
            self.stage = "down"
        if angle < 30 and self.stage == "down":
            self.stage = "up"
            self.counter += 1

        return self.counter

    def perform_exercise(self, frame, max_reps):
        """Process frame and track bicep curls exercise."""
        if not self.timer_started:
            self.timer_instance.start()  # ✅ Start timer when first frame is processed
            self.timer_started = True

        remaining_time = self.timer_instance.get_remaining_time()
        
        if remaining_time <= 0:
            return frame, 0, self.counter, True  # ✅ Indicate that time is up

        image, landmarks = self.detect(frame)

        if landmarks:
            shoulder = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].x, 
                        landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
            elbow = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW].x, 
                     landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW].y]
            wrist = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].x, 
                     landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].y]

            angle = self.calculate_angle(shoulder, elbow, wrist)
            self.counter = self.update(angle)
            self.ui_renderer.provide_feedback(angle, image, "bicep_curls")
            self.ui_renderer.draw_progress_bar(image, self.counter, max_reps, "bicep_curls")

            image = self.ui_renderer.render_status_box(image, self.counter, self.stage, remaining_time)

            mp_drawing.draw_landmarks(
                image, landmarks, mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                connection_drawing_spec=mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2)
            )

            # ✅ Display angle
            elbow_coords = tuple(np.multiply(elbow, [frame.shape[1], frame.shape[0]]).astype(int))
            cv2.putText(image, str(angle), elbow_coords, cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
        else:
            angle = 0

        return image, angle, self.counter, False  # ✅ Time is not up yet