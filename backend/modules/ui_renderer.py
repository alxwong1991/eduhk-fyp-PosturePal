import cv2

class UIRenderer:
    def __init__(self):
        pass

    def render_status_box(self, frame, counter, stage, remaining_time):
        # Setup status box
        cv2.rectangle(frame, (0, 0), (430, 73), (245, 117, 16), -1)

        # Rep data
        cv2.putText(frame, "REPS", (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
        cv2.putText(frame, str(counter), (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)

        # Stage data
        cv2.putText(frame, "STAGE", (105, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
        cv2.putText(frame, stage, (110, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)

        # Timer data
        if remaining_time <= 5:
            # Change color to red
            cv2.putText(frame, "TIME", (300, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
            cv2.putText(frame, f"{remaining_time}s", (310, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 2, cv2.LINE_AA)
        else:
            # Default color
            cv2.putText(frame, "TIME", (295, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
            cv2.putText(frame, f"{remaining_time}s", (310, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)

        return frame