import { create } from "zustand";
import { saveExerciseLog, fetchExerciseLogs, deleteExerciseLog } from "../api/exerciseLog";

const useExerciseLogStore = create((set) => ({
  saving: false,
  deleting: false,
  error: null,
  exerciseLogs: [],

  // ✅ Fetch logs and update store
  loadLogs: async (userId) => {
    try {
      const logs = await fetchExerciseLogs(userId);
      set({ exerciseLogs: logs });
    } catch (err) {
      set({ error: err.message });
    }
  },

  // ✅ Save a new log
  saveLog: async (userId, exerciseName, totalReps, totalCalories, durationMinutes) => {
    set({ saving: true, error: null });

    try {
      const response = await saveExerciseLog(userId, exerciseName, totalReps, totalCalories, durationMinutes);
      set((state) => ({ exerciseLogs: [response, ...state.exerciseLogs] })); // ✅ Add new log to state
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ saving: false });
    }
  },

  // ✅ Delete an existing log
  deleteLog: async (logId) => {
    set({ deleting: true, error: null });

    try {
      await deleteExerciseLog(logId);
      set((state) => ({ exerciseLogs: state.exerciseLogs.filter((log) => log.id !== logId) })); // ✅ Remove from state
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ deleting: false });
    }
  },
}));

export default useExerciseLogStore;