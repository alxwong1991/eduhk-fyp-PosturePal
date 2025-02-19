import time

class CountdownTimer:
    def __init__(self, duration):
        self.duration = duration
        self.start_time = None

    # Start the timer
    def start(self):
        self.start_time = time.time()

    # Calculate the remaining time
    def get_remaining_time(self):
        if self.start_time is None:
            return self.duration

        elapsed_time = time.time() - self.start_time
        remaining_time = max(0, self.duration - elapsed_time)
        return round(remaining_time)