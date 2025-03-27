import numpy as np

def calculate_angle(a, b, c):
    """✅ Calculate the angle between three points.
    
    Args:
        a (list or tuple): Coordinates of the first point (x, y).
        b (list or tuple): Coordinates of the second point (x, y) (joint).
        c (list or tuple): Coordinates of the third point (x, y).

    Returns:
        float: Angle in degrees (0-180°).
    """
    a, b, c = np.array(a), np.array(b), np.array(c)

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    return angle if angle <= 180.0 else 360 - angle