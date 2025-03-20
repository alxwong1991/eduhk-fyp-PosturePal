from config.met_values import MET_VALUES  

def calculate_calories_burned(weight_kg: float, exercise_name: str, duration_minutes: float) -> float:
    """✅ Calculate calories burned based on MET, user weight, and duration."""
    met = MET_VALUES.get(exercise_name.lower(), 3.5)  # Default MET = 3.5
    return round(met * weight_kg * (duration_minutes / 60) * 3.5 * 5, 2)