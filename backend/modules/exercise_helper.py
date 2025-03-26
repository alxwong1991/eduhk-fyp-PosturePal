from exercises.bicep_curls import BicepCurls
from exercises.squats import Squats

class ExerciseHelper:
    def __init__(self):
        """✅ Store all exercises dynamically in a dictionary."""
        self.exercises = {}
        self.previous_counter = 0

    def setup_exercise(self, exercise_name):
        """✅ Ensure Pose detector is properly reset before starting a new exercise."""
        if exercise_name in self.exercises:
            del self.exercises[exercise_name]  # ✅ Delete previous instance to force recreation

        exercise_classes = {
            "bicep_curls": BicepCurls,
            "squats": Squats,
        }

        if exercise_name not in exercise_classes:
            raise ValueError(f"Invalid exercise: {exercise_name}")

        # ✅ Ensure the exercise instance is created
        try:
            self.exercises[exercise_name] = exercise_classes[exercise_name]()
            print(f"✅ Successfully initialized {exercise_name}")
        except Exception as e:
            print(f"❌ Failed to initialize {exercise_name}: {e}")
            raise RuntimeError(f"Could not initialize {exercise_name}")

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