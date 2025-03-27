import cv2
from modules.feedback_handler import FeedbackHandler

class UIRenderer:
    def __init__(self):
        self.feedback_handler = FeedbackHandler()

    def render_status_box(self, frame, counter, stage, remaining_time):
        # Setup status box
        cv2.rectangle(frame, (0, 0), (430, 80), (245, 117, 16), -1)

        # Rep data
        cv2.putText(frame, "REPS", (15, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
        cv2.putText(frame, str(counter), (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)

        # Stage data
        cv2.putText(frame, "STAGE", (105, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
        cv2.putText(frame, stage, (110, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)

        # Timer data
        timer_color = (255, 255, 255)  # Default white
        if remaining_time <= 5:
            timer_color = (0, 0, 255)  # Red

        cv2.putText(frame, "TIME", (295, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
        cv2.putText(frame, f"{remaining_time}s", (310, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, timer_color, 2, cv2.LINE_AA)

        return frame
        
    def display_feedback_message(self, image, feedback_message, color):
        """✅ Display a feedback message on the screen."""
        if not feedback_message:
            return # No message to display

        banner_x = 20
        banner_y = image.shape[0] - 60
        banner_width = 300
        banner_height = 40

        overlay = image.copy()
        cv2.rectangle(overlay, (banner_x, banner_y), 
                    (banner_x + banner_width, banner_y + banner_height), color, -1)
        cv2.addWeighted(overlay, 0.5, image, 0.5, 0, image)

        cv2.putText(image, feedback_message, (banner_x + 15, banner_y + 27),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)

    def draw_progress_bar(self, image, counter, max_reps, exercise_name):
        """✅ Draws a vertical progress bar with labels based on exercise."""
        bar_height = 200  # Height of the progress bar
        bar_x = image.shape[1] - 60  # Position from the right
        bar_y_bottom = image.shape[0] - 50  # Bottom position
        bar_y_top = bar_y_bottom - bar_height  # Top position

        # ✅ Scale progress dynamically based on max_reps
        progress = int((counter / max_reps) * bar_height)

        # ✅ Clear previous progress bar by redrawing the background
        cv2.rectangle(image, (bar_x - 10, bar_y_top), (bar_x + 10, bar_y_bottom), (50, 50, 50), -1)

        # ✅ Draw filled progress
        cv2.rectangle(image, (bar_x - 10, bar_y_bottom - progress), (bar_x + 10, bar_y_bottom), (0, 255, 0), -1)

        # ✅ Display progress count
        cv2.putText(image, f'{counter}/{max_reps}', (bar_x - 40, bar_y_top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

        # Add exercise label
        # label = "Progress"
        # if exercise_name == "bicep_curls":
        #     label = "Bicep Curls Progress"
        # elif exercise_name == "squats":
        #     label = "Squats Progress"

        # cv2.putText(image, label, (bar_x - 80, bar_y_top - 30),
        #             cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    # def provide_feedback(self, landmarks, image, exercise_name, squat_angle = None):
    #     """✅ Modular feedback system for multiple exercises."""
    #     if landmarks is None:
    #         return # No landmarks detected
        
    #     feedback_rules = self.feedback_handler.get_feedback_rules()
    #     feedback_message, color = "", (255, 255, 255)

    #     # ✅ Run all feedback checks for the exercise
    #     for check in feedback_rules.get(exercise_name, []):
    #         message, msg_color = check(landmarks)
    #         if message:
    #             feedback_message = message
    #             color = msg_color
    #             break  # ✅ Show only one feedback message at a time

    #     if not feedback_message:
    #         return  # No feedback needed

    #     self.display_feedback_message(image, feedback_message, color)

    def provide_feedback(self, landmarks, image, exercise_name, squat_angle=None):
        """✅ Modular feedback system for multiple exercises."""
        if landmarks is None:
            return  # No landmarks detected

        feedback_checks = {
            "squats": [
                lambda l: self.feedback_handler.check_arm_forward_when_down(l, squat_angle, image)
            ],
            # ✅ Add more feedback functions for other exercises if needed
        }

        # ✅ Get the list of feedback checks for the given exercise
        checks = feedback_checks.get(exercise_name, [])
        feedback_messages = []  # Store multiple feedback messages if needed

        for check in checks:
            message, msg_color = check(landmarks)
            if message:
                feedback_messages.append((message, msg_color))

        # ✅ Display feedback messages (supporting multiple messages)
        for message, color in feedback_messages:
            self.display_feedback_message(image, message, color)