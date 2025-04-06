import cv2
from mediapipe.python.solutions import pose as mp_pose
from modules.pose_math import calculate_angle
import numpy as np

class FeedbackHandler:
    def __init__(self):
        pass

    # def check_back_straight(self, landmarks):
    #     """Check if the user's back is straight for bicep curls."""
    #     if not hasattr(landmarks, "landmark"):
    #         return None, None  

    #     left_shoulder = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].x,
    #                      landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
    #     left_hip = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP].x,
    #                 landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP].y]
    #     right_shoulder = [landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER].x,
    #                      landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER].y]
    #     right_hip = [landmarks.landmark[mp_pose.PoseLandmark.RIGHT_HIP].x,
    #                  landmarks.landmark[mp_pose.PoseLandmark.RIGHT_HIP].y]

    #     back_angle = self.calculate_angle(left_shoulder, left_hip, right_shoulder, right_hip)
    #     if back_angle < 165:
    #         return "Keep your back straight!", (0, 0, 255)  # Red warning

    #     return None, None

    # Bicep Curls
    def check_arm_extension(self, landmarks):
        """Check if the user's arm is fully extended for bicep curls."""
        if not hasattr(landmarks, "landmark"):
            return None, None  

        left_shoulder = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].x,
                         landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
        left_elbow = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW].x,
                      landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW].y]
        left_wrist = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].x,
                      landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].y]

        arm_angle = calculate_angle(left_shoulder, left_elbow, left_wrist)
        
        if arm_angle > 160:
            print("yes")
            return "Good form! Keep going!", (0, 255, 0)
        else:
            print("no")
            return "Extend your arm!", (0, 0, 255)
    
    # Squats
    def check_arm_forward_when_down(self, landmarks, squat_angle, frame):
        """Check if the user's arms are straight forward when squatting down."""
        if not hasattr(landmarks, "landmark"):
            return None, None
        
        # Check arm position when in squat position (angle < 150°)
        if squat_angle > 150:
            return None, None

        left_shoulder = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].x,
                         landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
        left_elbow = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW].x,
                      landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW].y]
        left_wrist = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].x,
                      landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].y]

        arm_forward_angle = calculate_angle(left_shoulder, left_elbow, left_wrist)
        print(f"[INFO] Arm Straight Angle Detected: {arm_forward_angle:.2f}°", end=" - ")

        # Calculate elbow coordinates for visualization
        frame_height, frame_width, _ = frame.shape
        elbow_coords = tuple(np.multiply(left_elbow, [frame_width, frame_height]).astype(int))

        # Draw angle value on the screen near the elbow
        cv2.putText(frame, f"{int(arm_forward_angle)}°", elbow_coords, cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

        if arm_forward_angle <= 100:
            print("yes")
            return "Good form! Keep going!", (0, 255, 0)
        else:
            print("no")
            return "Arms straight forward!", (0, 0, 255)

    def get_feedback_rules(self):
        """Defines feedback rules for different exercises."""
        return {
            "bicep_curls": [
                # self.check_back_straight,
                self.check_arm_extension
            ],
            "squats": [
                self.check_arm_forward_when_down
            ]
        }