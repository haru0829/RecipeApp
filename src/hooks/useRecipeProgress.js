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
        note: progress.taskNotes ? progress.taskNotes[i] : "",
      })
    );
    setTodayTasks(stepTasks);

    if (
      safeStepIndex === selectedRecipe.steps.length - 1 &&
      stepTasks.every((t) => t.done)
    ) {
      setIsFinished(true); // 🔥 初期状態で完了している場合も反映
    }
  }, [selectedRecipe, initialProgress]);

  const saveProgress = async (stepIndex, taskStates, taskNotes = []) => {
    const user = auth.currentUser;
    if (!user || !selectedRecipe?.id) return;

    const cleanedTaskStates = taskStates.map((t) => !!t);
    const cleanedTaskNotes = taskNotes.map((n) => n || "");

    const userRef = doc(db, "users", user.uid);
    const currentProgress = {
      currentStep: stepIndex,
      taskStates: cleanedTaskStates,
      taskNotes: cleanedTaskNotes,
    };

    // 自分自身の状態にも保存
    if (
      stepIndex === selectedRecipe.steps.length - 1 &&
      cleanedTaskStates.every((t) => t)
    ) {
      setIsFinished(true); // 🔥 リアルタイム反映
    }

    await updateDoc(userRef, {
      [`progress.${selectedRecipe.id}`]: currentProgress,
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
