from mediapipe.python.solutions import pose as mp_pose
from exercises.bicep_curls import BicepCurls
from exercises.squats import Squats

class ExerciseHelper:
    def __init__(self):
        self.bicep_curls = None
        self.squats = None

    def setup_bicep_curls(self):
        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            self.bicep_curls = BicepCurls(pose)

    def perform_bicep_curls(self, frame):
        frame, angle, counter = self.bicep_curls.perform_exercise(frame)
        return frame, angle, counter
    
    def setup_squats(self):
        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            self.squats = Squats(pose)

    def perform_squats(self, frame):
        frame, angle, counter = self.squats.perform_exercise(frame)
        return frame, angle, counter