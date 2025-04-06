from config.met_values import MET_VALUES

def estimate_calories_burned(
    weight_kg: float,
    height_cm: float,
    age: int,
    gender: str,
    exercise_name: str,
    duration_seconds: float
) -> float:
    """
    Estimate calories burned using MET values and personal data.

    Formula:
        Calories = MET × Weight (kg) × Duration (hours)

    This is a hybrid approach that uses:
    - MET values for specific exercises
    - User's weight, height, age, and gender (for future extensions)

    Args:
        weight_kg (float): User's weight in kilograms
        height_cm (float): User's height in centimeters (currently unused)
        age (int): User's age in years (currently unused)
        gender (str): User's gender ("male" or "female")
        exercise_name (str): Name of the exercise
        duration_seconds (float): Duration of exercise in seconds

    Returns:
        float: Estimated calories burned
    """
    # Normalize inputs
    gender = gender.lower().strip()
    exercise_name = exercise_name.lower().strip()

    # Fallback MET value if not found
    met = MET_VALUES.get(exercise_name, 3.5)
    
    # Convert duration to hours
    duration_hours = duration_seconds / 3600

    # Calculate calories burned
    calories = met * weight_kg * duration_hours

    return round(calories, 4)