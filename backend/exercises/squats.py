import numpy as np
import cv2
from mediapipe.python.solutions import drawing_utils as mp_drawing
from mediapipe.python.solutions import pose as mp_pose
from modules.countdown_timer import CountdownTimer
from modules.ui_renderer import UIRenderer

class Squats:
    def __init__(self):
        """Initialize Squats tracking."""
        self.counter = 0
        self.stage = None
        self.pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

        # Countdown timer (30 seconds)
        self.timer = 30
        self.timer_instance = CountdownTimer(self.timer)
        self.timer_started = False

        self.ui_renderer = UIRenderer()

    def reset_counter(self):
        """Reset counter and restart the timer."""
        self.counter = 0
        self.stage = None
        self.timer_started = False

    def calculate_angle(self, a, b, c):
        """Calculate angle between three points."""
        a = np.array(a)
        b = np.array(b)
        c = np.array(c)

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
            self.stage = "up"
        if angle < 90 and self.stage == "up":
            self.stage = "down"
            self.counter += 1

        return self.counter

    def perform_exercise(self, frame):
        """Process frame and track squats exercise."""
        if not self.timer_started:
            self.timer_instance.start()
            self.timer_started = True

        remaining_time = self.timer_instance.get_remaining_time()
        
        if remaining_time <= 0:
            return frame, 0, self.counter, True  # Indicate that time is up

        image, landmarks = self.detect(frame)

        if landmarks:
            # Get coordinates for squat angle calculation
            hip = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP].x,
                   landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP].y]
            knee = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_KNEE].x,
                    landmarks.landmark[mp_pose.PoseLandmark.LEFT_KNEE].y]
            ankle = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_ANKLE].x,
                     landmarks.landmark[mp_pose.PoseLandmark.LEFT_ANKLE].y]

            angle = self.calculate_angle(hip, knee, ankle)
            self.counter = self.update(angle)
            
            image = self.ui_renderer.render_status_box(image, self.counter, self.stage, remaining_time)

            # Draw pose landmarks
            mp_drawing.draw_landmarks(
                image, landmarks, mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                connection_drawing_spec=mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2)
            )

            # Display angle at knee
            knee_coords = tuple(np.multiply(knee, [frame.shape[1], frame.shape[0]]).astype(int))
            cv2.putText(image, str(int(angle)), knee_coords, 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

        else:
            angle = 0

        return image, angle, self.counter, False  # Time is not up yet