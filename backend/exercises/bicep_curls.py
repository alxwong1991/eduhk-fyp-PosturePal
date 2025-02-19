import numpy as np
import cv2
from mediapipe.python.solutions import drawing_utils as mp_drawing
from mediapipe.python.solutions import pose as mp_pose
from modules.countdown_timer import CountdownTimer
from modules.ui_renderer import UIRenderer

class BicepCurls:
    def __init__(self, pose):
        # Curl counter variables
        self.counter = 0
        self.stage = None
        self.pose = pose
        
        # Setup mediapipe instance
        self.pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

        # Countdown timer variables
        self.timer = 30
        self.timer_instance = CountdownTimer(self.timer)
        
        # UI Renderer instance
        self.ui_renderer = UIRenderer()

    def calculate_angle(self, a, b, c):
        a = np.array(a)  # First
        b = np.array(b)  # Mid
        c = np.array(c)  # End

        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)

        if angle > 180.0:
            angle = 360 - angle

        return angle

    def detect(self, frame):
        # Recolor image to RGB
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False

        # Make detection
        results = self.pose.process(image)

        # Recolor back to BGR
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        return image, results.pose_landmarks

    def update(self, angle):
        # Curl counter logic
        if angle > 160:
            self.stage = "down"
        if angle < 30 and self.stage == "down":
            self.stage = "up"
            self.counter += 1
            print(self.counter)

        return self.counter

    def perform_exercise(self, frame):
        # Perform bicep curls exercise
        image, landmarks = self.detect(frame)
        
        if landmarks is not None:
            shoulder = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].x, 
                        landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
            elbow = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW].x, 
                     landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW].y]
            wrist = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].x, 
                     landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].y]

            # Calculate angle
            angle = self.calculate_angle(shoulder, elbow, wrist)

            # Update exercise counter
            self.counter = self.update(angle)

            # Get remaining time
            remaining_time = self.timer_instance.get_remaining_time()

            # Render counter, stage and countdown timer on the frame
            image = self.ui_renderer.render_status_box(image, self.counter, self.stage, remaining_time)

            # Draw landmarks and connections on the frame
            mp_drawing.draw_landmarks(
                image, landmarks, mp_pose.POSE_CONNECTIONS,
                landmark_drawing_spec=mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                connection_drawing_spec=mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2)
            )
            
            # Visualize angle
            elbow_coords = tuple(np.multiply(elbow, [frame.shape[1], frame.shape[0]]).astype(int))
            cv2.putText(image, str(angle), elbow_coords, cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)
        else:
            angle = 0

        # Return the modified image and angle
        return image, angle, self.counter