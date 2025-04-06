import { create } from "zustand";
import { checkCamera as apiCheckCamera, createExerciseWebSocket } from "../api/websocket";

const useWebsocketStore = create((set, get) => ({
  image: null,
  counter: 0,
  calories: null,
  exerciseFinished: false,
  isCameraReady: false,
  webSocket: null,
  resultData: null,

  checkCamera: async () => {
    const isReady = await apiCheckCamera();
    set({ isCameraReady: isReady });
    return isReady;
  },

  startWebSocketExercise: async (exerciseType, difficulty, onComplete) => {
    set({ resultData: null, image: null, counter: 0, calories: null, exerciseFinished: false });

    const cameraReady = await apiCheckCamera();
    if (!cameraReady) {
      console.error("Camera is not ready, aborting exercise.");
      return;
    }

    try {
      const ws = createExerciseWebSocket(
        exerciseType,
        difficulty,
        (newImage, newCounter, newCalories) => {
          set({
            image: newImage ? `data:image/jpeg;base64,${newImage}` : null,
            counter: newCounter,
            calories: newCalories ?? null,
          });
        },
        (data) => {
          console.log("🟢 **Frontend Received Final Data:**", data);
          set({ resultData: data || {}, exerciseFinished: true });

          if (onComplete) onComplete(data || {});
        }
      );

      set({ webSocket: ws });

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        get().cleanupWebSocket();
        if (onComplete) onComplete({});
      };

      ws.onclose = () => {
        console.log("🔴 WebSocket closed.");
        get().cleanupWebSocket();
      };
    } catch (error) {
      console.error("Error starting WebSocket exercise:", error);
      get().cleanupWebSocket();
      if (onComplete) onComplete({});
    }
  },

  resetWebSocketState: () => set({ image: null, counter: 0, calories: null, exerciseFinished: false }),

  cleanupWebSocket: () => {
    const { webSocket } = get();
    if (webSocket) {
      webSocket.close();
      set({ webSocket: null });
    }
    set({ exerciseFinished: true });
  },
}));

export default useWebsocketStore;