import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const useRecipeProgress = (selectedRecipe, initialProgress) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(null);
  const [todayTasks, setTodayTasks] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!selectedRecipe || !Array.isArray(selectedRecipe.steps)) return;

    const progressData = initialProgress?.[selectedRecipe.id] || {};
    const stepIndex = progressData.currentStep || 0;
    const safeStepIndex =
      stepIndex >= selectedRecipe.steps.length ? 0 : stepIndex;

    setCurrentStepIndex(safeStepIndex);

    const stepTasks = selectedRecipe.steps[safeStepIndex].tasks.map(
      (task, i) => ({
        title: task,
        done: progressData.taskStates ? progressData.taskStates[i] : false,
        note: progressData.taskNotes ? progressData.taskNotes[i] : "",
      })
    );
    setTodayTasks(stepTasks);

    if (
      safeStepIndex === selectedRecipe.steps.length - 1 &&
      stepTasks.every((t) => t.done)
    ) {
      setIsFinished(true);
    }
  }, [selectedRecipe, initialProgress]);

  const saveProgress = async (stepIndex, taskStates, taskNotes) => {
    const user = auth.currentUser;
    if (!user || !selectedRecipe?.id) return;

    const cleanedTaskStates = taskStates.map((t) => !!t);
    const cleanedTaskNotes = taskNotes || [];

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const currentProgress = userSnap.exists()
      ? userSnap.data().progress || {}
      : {};

    const updatedProgress = {
      ...currentProgress,
      [selectedRecipe.id]: {
        currentStep: stepIndex,
        taskStates: cleanedTaskStates,
        taskNotes: cleanedTaskNotes,
      },
    };

    await updateDoc(userRef, {
      progress: updatedProgress,
    });
  };

  return {
    currentStepIndex,
    setCurrentStepIndex,
    todayTasks,
    setTodayTasks,
    isFinished,
    setIsFinished,
    saveProgress,
  };
};
