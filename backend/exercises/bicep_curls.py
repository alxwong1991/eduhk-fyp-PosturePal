import numpy as np
import cv2
from mediapipe.python.solutions import drawing_utils as mp_drawing
from mediapipe.python.solutions import pose as mp_pose
from modules.countdown_timer import CountdownTimer
from modules.ui_renderer import UIRenderer
from modules.feedback_handler import FeedbackHandler
from config.difficulty_config import DIFFICULTY_LEVELS, DEFAULT_DIFFICULTY
from modules.pose_math import calculate_angle

class BicepCurls:
    def __init__(self):
        """Initialize Bicep Curls tracking."""
        self.counter = 0
        self.stage = None
        self.pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
        self.max_reps = DIFFICULTY_LEVELS.get("bicep_curls", {}).get(DEFAULT_DIFFICULTY, 10)

        # Timer setup
        self.timer = 30
        self.timer_instance = CountdownTimer(self.timer)
        self.timer_started = False

        self.ui_renderer = UIRenderer()
        self.feedback_handler = FeedbackHandler()
        self.feedback_message = "Start Exercise!"  # Default message

    def set_difficulty(self, difficulty):
        """Dynamically update max reps based on difficulty."""
        self.max_reps = DIFFICULTY_LEVELS["bicep_curls"].get(difficulty, self.max_reps)

    def reset_counter(self):
        """Reset counter and restart the timer."""
        self.counter = 0
        self.stage = None
        self.timer_started = False  # Reset timer flag

    def detect(self, frame):
        """Detects pose landmarks from an image frame."""
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False

        results = self.pose.process(image)

        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        return image, results.pose_landmarks if results.pose_landmarks else None

    # def update(self, angle, landmarks):
    #     """Update exercise counter only if all posture checks pass via FeedbackHandler."""
    #     # Use FeedbackHandler for modular posture checks
    #     passed_checks = {
    #         "arm": False,
    #         "back": False
    #     }

    #     # # Check if the back is straight
    #     back_message, _ = self.feedback_handler.check_back_straight(landmarks)
    #     if back_message is None:  # No feedback → Good posture
    #         passed_checks["back"] = True

    #     # Check if the arm is fully extended
    #     arm_message, arm_color = self.feedback_handler.check_arm_extension(landmarks)
    #     if arm_message == "Good form! Keep going!":
    #         passed_checks["arm"] = True

    #     # Only increment if ALL conditions are met
    #     if angle > 160:
    #         self.stage = "down"
    #     if angle < 30 and self.stage == "down" and all(passed_checks.values()):
    #         self.stage = "up"
    #         self.counter += 1  # Now counter increments only when posture is correct

    #         self.ui_renderer.display_feedback_message(self.current_frame, arm_message, arm_color)

    #     return self.counter

    def update(self, angle, landmarks):
        """Update exercise counter and display feedback messages."""
        arm_message = None  # Ensure initialization
        arm_color = (255, 255, 255)  # Default white color

        if landmarks:
            # Get feedback message
            arm_message, arm_color = self.feedback_handler.check_arm_extension(landmarks)

            if arm_message:
                self.feedback_message = arm_message  # Store latest feedback message

            # print(f"[INFO] Curl Angle Detected: {angle:.2f}°", end=" - ")

            if angle > 160:
                self.stage = "down"
                print("Extend")
            if angle < 30 and self.stage == "down":
                self.stage = "up"
                self.counter += 1  # Increment only when posture is correct
                print("Curl")

        return self.counter, arm_color

    def perform_exercise(self, frame, max_reps):
        """Process frame and track bicep curls exercise with correct posture check."""
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
            shoulder = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].x, 
                        landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
            elbow = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW].x, 
                    landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW].y]
            wrist = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].x, 
                    landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].y]

            angle = calculate_angle(shoulder, elbow, wrist)

            update_result = self.update(angle, landmarks)
            if isinstance(update_result, tuple) and len(update_result) == 2:
                self.counter, arm_color = update_result
            else:
                print(f"ERROR: update() returned {update_result}, expected (counter, arm_color)")
                return frame, angle, self.counter, False  # Prevent crash

            # Pass landmarks to update() to ensure correct form before counting
            self.counter, arm_color = self.update(angle, landmarks)

            # Provide feedback to user
            self.ui_renderer.provide_feedback(landmarks, image, "bicep_curls")
            self.ui_renderer.draw_progress_bar(image, self.counter, max_reps, "bicep_curls")

            # Ensure feedback message is displayed **AFTER** all drawings
            self.ui_renderer.display_feedback_message(image, self.feedback_message, arm_color)

            image = self.ui_renderer.render_status_box(image, self.counter, self.stage, remaining_time)

            # Draw pose landmarks
            mp_drawing.draw_landmarks(
                image, landmarks, mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                connection_drawing_spec=mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2)
            )

            # Visualize angle at elbow position
            elbow_coords = tuple(np.multiply(elbow, [frame.shape[1], frame.shape[0]]).astype(int))
            elbow_coords = (max(elbow_coords[0] - 20, 0), max(elbow_coords[1] - 10, 0))  # Adjust for better visibility
            cv2.putText(image, f"{int(angle)}°", elbow_coords, cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

        return image, angle, self.counter, False