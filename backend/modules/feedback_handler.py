from mediapipe.python.solutions import pose as mp_pose
import numpy as np

class FeedbackHandler:
    def __init__(self):
        pass

    def calculate_angle(self, a, b, c):
        """Calculate the angle between three points."""
        a, b, c = np.array(a), np.array(b), np.array(c)
        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        return angle if angle <= 180.0 else 360 - angle

    def check_back_straight(self, landmarks):
        """✅ Check if the user's back is straight for bicep curls."""
        if not hasattr(landmarks, "landmark"):
            return None, None  

        left_shoulder = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].x,
                         landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
        left_hip = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP].x,
                    landmarks.landmark[mp_pose.PoseLandmark.LEFT_HIP].y]
        right_shoulder = [landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER].x,
                         landmarks.landmark[mp_pose.PoseLandmark.RIGHT_SHOULDER].y]
        right_hip = [landmarks.landmark[mp_pose.PoseLandmark.RIGHT_HIP].x,
                     landmarks.landmark[mp_pose.PoseLandmark.RIGHT_HIP].y]

        back_angle = self.calculate_angle(left_shoulder, left_hip, right_shoulder, right_hip)
        if back_angle < 165:
            return "Keep your back straight!", (0, 0, 255)  # Red warning

        return None, None

    # def check_arm_extension(self, landmarks):
    #     """✅ Check if the user's arm is fully extended for bicep curls."""
    #     if not hasattr(landmarks, "landmark"):
    #         return None, None  

    #     left_shoulder = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].x,
    #                      landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
    #     left_elbow = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW].x,
    #                   landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW].y]
    #     left_wrist = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].x,
    #                   landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].y]

    #     arm_angle = self.calculate_angle(left_shoulder, left_elbow, left_wrist)
        
    #     if arm_angle > 160:
    #         return "Good form! Keep going!", (0, 255, 0)
    #     else:
    #         return "Fully extend your arm!", (0, 0, 255)

    def check_arm_forward_when_down(self, landmarks):
        """✅ Check if the user's arms are straight forward when squatting down."""
        if not hasattr(landmarks, "landmark"):
            return None, None  

        left_shoulder = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].x,
                         landmarks.landmark[mp_pose.PoseLandmark.LEFT_SHOULDER].y]
        left_elbow = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW].x,
                      landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW].y]
        left_wrist = [landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].x,
                      landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST].y]

        arm_forward_angle = self.calculate_angle(left_shoulder, left_elbow, left_wrist)
        
        if arm_forward_angle < 70:
            return "Keep your arms straight forward!", (0, 0, 255)  # Red warning

        return None, None

    def get_feedback_rules(self):
        """✅ Defines feedback rules for different exercises."""
        return {
            "bicep_curls": [
                # self.check_back_straight,
                self.check_arm_extension
            ],
            "squats": [
                self.check_arm_forward_when_down
            ]
        }