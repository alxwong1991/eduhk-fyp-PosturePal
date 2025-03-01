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
            cv2.putText(frame, "TIME", (300, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
            cv2.putText(frame, f"{remaining_time}s", (310, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (0, 0, 255), 2, cv2.LINE_AA)
        else:
            cv2.putText(frame, "TIME", (295, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)
            cv2.putText(frame, f"{remaining_time}s", (310, 60), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 2, cv2.LINE_AA)

        return frame

    def provide_feedback_bicep_curls(self, angle, image):
        """✅ Provide real-time feedback in bottom-left corner."""
        if angle > 160:
            feedback_message = "Fully extend your arm!"
            color = (0, 0, 255)  # Red for warning
        elif angle < 30:
            feedback_message = "Great contraction!"
            color = (0, 255, 0)  # Green for good form
        else:
            return  # No message needed

        # ✅ Define banner position (Bottom-left)
        banner_x = 20
        banner_y = image.shape[0] - 60
        banner_width = 300
        banner_height = 40

        # ✅ Create semi-transparent background
        overlay = image.copy()
        cv2.rectangle(overlay, (banner_x, banner_y), 
                      (banner_x + banner_width, banner_y + banner_height), color, -1)
        alpha = 0.5
        cv2.addWeighted(overlay, alpha, image, 1 - alpha, 0, image)

        # ✅ Draw text with smaller font
        cv2.putText(image, feedback_message, (banner_x + 15, banner_y + 27),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)

    def draw_progress_bar_bicep_curls(self, image, counter, max_reps):
        """✅ Draws a vertical progress bar on the right based on difficulty."""
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