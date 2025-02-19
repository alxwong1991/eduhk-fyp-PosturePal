from abc import ABC, abstractmethod
import numpy as np
from modules.countdown_timer import CountdownTimer
from modules.ui_renderer import UIRenderer

class BaseExercise(ABC):
    def __init__(self):
        self.counter = 0
        self.stage = None
        self.timer = CountdownTimer(30)
        self.ui_renderer = UIRenderer()

    @abstractmethod
    def perform_exercise(self, frame):
        """Abstract method to be implemented by each exercise."""
        pass

    def calculate_angle(self, a, b, c):
        """Calculate angle between three points."""
        a, b, c = np.array(a), np.array(b), np.array(c)
        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        return 360 - angle if angle > 180 else angle