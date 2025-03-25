import { create } from "zustand";
import { saveExerciseLog } from "../api/exerciseLog";

const useExerciseLogStore = create((set) => ({
  saving: false,
  error: null,

  saveLog: async (userId, exerciseName, totalReps, totalCalories, durationMinutes) => {
    set({ saving: true, error: null });

    try {
      const response = await saveExerciseLog(userId, exerciseName, totalReps, totalCalories, durationMinutes);
      return response;
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ saving: false });
    }
  },
}));

export default useExerciseLogStore;