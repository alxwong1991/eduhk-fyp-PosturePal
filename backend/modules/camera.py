import cv2

class Camera:
    def __init__(self):
        self.cap = None

    def start_capture(self):
        self.cap = cv2.VideoCapture(1)

    def read_frame(self):
        ret, frame = self.cap.read()
        return ret, frame

    def release_capture(self):
        if self.cap is not None:
            self.cap.release()