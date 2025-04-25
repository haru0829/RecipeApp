import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const useRecipeProgress = (selectedRecipe, initialProgress) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [todayTasks, setTodayTasks] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!selectedRecipe || !Array.isArray(selectedRecipe.steps)) return;

    const progress = initialProgress?.[selectedRecipe.id] || {};
    const stepIndex = progress.currentStep || 0;
    const safeStepIndex =
      stepIndex >= selectedRecipe.steps.length ? 0 : stepIndex;

    setCurrentStepIndex(safeStepIndex);

    const stepTasks = selectedRecipe.steps[safeStepIndex].tasks.map(
      (task, i) => ({
        title: task,
        done: progress.taskStates ? progress.taskStates[i] : false,
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

  const saveProgress = async (stepIndex, taskStates) => {
    const user = auth.currentUser;
    if (!user) return;
    const cleanedTaskStates = taskStates.map((t) => !!t);
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      progress: {
        [selectedRecipe.id]: {
          currentStep: stepIndex,
          taskStates: cleanedTaskStates,
        },
      },
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
