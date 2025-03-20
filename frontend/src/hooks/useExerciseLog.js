import { useState } from "react";
import { saveExerciseLog } from "../api/exerciseLog";

export function useExerciseLog() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const saveLog = async (userId, exerciseName, totalReps, totalCalories, durationMinutes) => {
    setSaving(true);
    setError(null);
    
    try {
      const response = await saveExerciseLog(userId, exerciseName, totalReps, totalCalories, durationMinutes);
      return response;
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return { saveLog, saving, error };
}