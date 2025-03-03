# from mediapipe.python.solutions import pose as mp_pose
# from exercises.bicep_curls import BicepCurls
# from exercises.squats import Squats

# class ExerciseHelper:
#     def __init__(self):
#         self.bicep_curls = None
#         self.squats = None

#     def setup_bicep_curls(self):
#         with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
#             self.bicep_curls = BicepCurls(pose)

#     def perform_bicep_curls(self, frame):
#         frame, angle, counter = self.bicep_curls.perform_exercise(frame)
#         return frame, angle, counter
    
#     def setup_squats(self):
#         with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
#             self.squats = Squats(pose)

#     def perform_squats(self, frame):
#         frame, angle, counter = self.squats.perform_exercise(frame)
#         return frame, angle, counter

from mediapipe.python.solutions import pose as mp_pose
from exercises.bicep_curls import BicepCurls
from exercises.squats import Squats
from config.difficulty_config import DIFFICULTY_LEVELS, DEFAULT_DIFFICULTY

class ExerciseHelper:
    def __init__(self):
        """✅ Store all exercises dynamically in a dictionary."""
        self.exercises = {}

    def setup_exercise(self, exercise_name):
        """✅ Setup any exercise dynamically."""
        if exercise_name in self.exercises:
            return  # ✅ Already initialized

        exercise_classes = {
            "bicep_curls": BicepCurls,
            "squats": Squats,
        }

        if exercise_name not in exercise_classes:
            raise ValueError(f"Invalid exercise: {exercise_name}")
        
        self.exercises[exercise_name] = exercise_classes[exercise_name]()

        # with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        #     self.exercises[exercise_name] = exercise_classes[exercise_name](pose)

    def set_difficulty(self, exercise_name, difficulty):
        """✅ Set difficulty level for an exercise."""
        if exercise_name not in self.exercises:
            raise ValueError(f"Exercise '{exercise_name}' not initialized. Call setup_exercise() first.")

        self.exercises[exercise_name].set_difficulty(difficulty)

    def perform_exercise(self, exercise_name, frame, max_reps):
        """✅ Perform any exercise dynamically."""
        if exercise_name not in self.exercises:
            raise ValueError(f"Exercise '{exercise_name}' not initialized. Call setup_exercise() first.")

        return self.exercises[exercise_name].perform_exercise(frame, max_reps)