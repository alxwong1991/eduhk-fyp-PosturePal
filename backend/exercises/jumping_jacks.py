import numpy as np
import cv2
from mediapipe.python.solutions import drawing_utils as mp_drawing
from mediapipe.python.solutions import pose as mp_pose
from modules.countdown_timer import CountdownTimer
from modules.ui_renderer import UIRenderer
from modules.feedback_handler import FeedbackHandler
from config.difficulty_config import DIFFICULTY_LEVELS, DEFAULT_DIFFICULTY
from modules.pose_math import calculate_angle

class JumpingJacks:
    def __init__(self):
        """Initialize Jumping Jacks tracking."""
        self.counter = 0
        self.stage = None
        self.pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
        self.max_reps = DIFFICULTY_LEVELS.get("jumping_jacks", {}).get(DEFAULT_DIFFICULTY, 20)

        # Countdown timer
        self.timer = 40
        self.timer_instance = CountdownTimer(self.timer)
        self.timer_started = False

        self.ui_renderer = UIRenderer()
        self.feedback_handler = FeedbackHandler()
        self.feedback_message = ""

    def set_difficulty(self, difficulty):
        """Set difficulty level for Jumping Jacks."""
        self.max_reps = DIFFICULTY_LEVELS["jumping_jacks"].get(difficulty, self.max_reps)

    def reset_counter(self):
        """Reset counter and restart the timer."""
        self.counter = 0
        self.stage = None
        self.timer_started = False

    def detect(self, frame):
        """Detects pose landmarks from an image frame."""
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False

        results = self.pose.process(image)

        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        return image, results.pose_landmarks if results.pose_landmarks else None

    def update(self, landmarks, frame):
        """Update the exercise counter based on detected motion (arms & legs)."""
        if landmarks is None:
            return self.counter

        # Get key landmarks for Jumping Jacks
        left_wrist = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].x,
                      landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].y]
        right_wrist = [landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST].x,
                       landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST].y]
        left_ankle = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_ANKLE].x,
                      landmarks.landmark[mp_pose.PoseLandmark.LEFT_ANKLE].y]
        right_ankle = [landmarks.landmark[mp_pose.PoseLandmark.RIGHT_ANKLE].x,
                       landmarks.landmark[mp_pose.PoseLandmark.RIGHT_ANKLE].y]
        left_shoulder = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].x,
                         landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
        right_shoulder = [landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER].x,
                          landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER].y]

        # Check if hands are raised above shoulders (Jumping Up)
        hands_up = (left_wrist[1] < left_shoulder[1]) and (right_wrist[1] < right_shoulder[1])

        # Check if legs are apart (Jumping Out)
        leg_distance = abs(left_ankle[0] - right_ankle[0])
        legs_apart = leg_distance > 0.2  # Adjust this threshold as needed

        if hands_up and legs_apart:
            self.stage = "open"
        elif self.stage == "open" and not hands_up and not legs_apart:
            self.stage = "closed"
            self.counter += 1  # Count one Jumping Jack

        return self.counter

    def perform_exercise(self, frame, max_reps):
        """Process frame and track Jumping Jacks exercise."""
        if not self.timer_started:
            self.timer_instance = CountdownTimer(self.timer)
            self.timer_instance.start()
            self.timer_started = True

        remaining_time = self.timer_instance.get_remaining_time()

        if remaining_time <= 0:
            return frame, 0, self.counter, True  # Indicate that time is up

        image, landmarks = self.detect(frame)

        angle = 0

        if landmarks:
            self.counter = self.update(landmarks, frame)

            self.ui_renderer.provide_feedback(landmarks, image, "jumping_jacks")
            self.ui_renderer.draw_progress_bar(image, self.counter, max_reps, "jumping_jacks")

            image = self.ui_renderer.render_status_box(image, self.counter, self.stage, remaining_time)

            # Draw pose landmarks
            mp_drawing.draw_landmarks(
                image, landmarks, mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                connection_drawing_spec=mp_drawing.DrawingSpec(color=(255, 0, 0), thickness=2, circle_radius=2)
            )

        return image, angle, self.counter, False  # Time is not up yet