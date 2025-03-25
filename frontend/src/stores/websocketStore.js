import { create } from "zustand";
import { checkCamera as apiCheckCamera, createExerciseWebSocket } from "../api/websocket";

const useWebsocketStore = create((set) => ({
  image: "",
  counter: 0,
  calories: null, // ✅ Only available for logged-in users
  exerciseFinished: false,
  isCameraReady: false,
  webSocket: null,

  checkCamera: async () => {
    const isReady = await apiCheckCamera();
    set({ isCameraReady: isReady });
    return isReady;
  },

  startWebSocketExercise: async (exerciseType, difficulty, onComplete) => {
    set({ counter: 0, calories: null, image: "", exerciseFinished: false });

    const cameraReady = await apiCheckCamera();
    if (!cameraReady) {
      console.error("Camera is not ready, aborting exercise.");
      return;
    }

    set((state) => {
      if (state.webSocket) state.webSocket.close(); // Close existing WebSocket
      return { webSocket: null };
    });

    try {
      const ws = createExerciseWebSocket(
        exerciseType,
        difficulty,
        (newImage, newCounter, newCalories) => {
          set({
            image: `data:image/jpeg;base64,${newImage}`,
            counter: newCounter,
            calories: newCalories ?? null,
          });
        },
        (data) => {
          set({ exerciseFinished: true, webSocket: null });
          if (onComplete) onComplete(data);
        }
      );
    
      set({ webSocket: ws });
    
      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        set({ exerciseFinished: true, webSocket: null });
        if (onComplete) onComplete(null);  // ✅ Ensure `onComplete` is called even if there’s an error
      };
    } catch (error) {
      console.error("Error starting WebSocket exercise:", error);
      set({ exerciseFinished: true });
      if (onComplete) onComplete(null);  // ✅ Ensure callback is always executed
    }
  },

  stopWebSocketExercise: () => {
    set((state) => {
      if (state.webSocket && state.webSocket.readyState === WebSocket.OPEN) {
        state.webSocket.close();
      }
      return { webSocket: null, exerciseFinished: true };
    });
  },
}));

export default useWebsocketStore;