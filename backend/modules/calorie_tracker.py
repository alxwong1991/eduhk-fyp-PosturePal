from config.met_values import MET_VALUES

def calculate_calories_burned(weight_kg: float, exercise_name: str, duration_seconds: float) -> float:
    """✅ Calculate calories burned per second using MET values."""
    met = MET_VALUES.get(exercise_name.lower(), 3.5)  # Default MET = 3.5
    return round(met * weight_kg * duration_seconds * (0.0175 / 60), 4)  # ✅ Adjusted for seconds