import React, { useState, useEffect, useRef } from "react";
import "./Home.scss";
import ProgressCircle from "./ProgressCircle";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getDoc } from "firebase/firestore"; // 既にしていたらOK
import { addRecipeToFirestore } from "../AddRecipe";

const Main = ({ selectedRecipe, isAuth, initialProgress }) => {
  useEffect(() => {
    const fetchProgress = async () => {
      if (!hasRecipe || !auth.currentUser) return;
  
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
  
      const data = userSnap.data();
      const progress = data.progress?.[selectedRecipe.id];
      if (!progress) return;
  
      const stepIndex = progress.currentStep || 0;
      setCurrentStepIndex(stepIndex);
  
      const stepTasks = selectedRecipe.steps[stepIndex].tasks.map((t, i) => ({
        title: t,
        done: progress.taskStates?.[i] || false,
      }));
      setTodayTasks(stepTasks);
    };
  
    fetchProgress();
  }, [selectedRecipe]);
  
  useEffect(() => {
    console.log("selectedRecipe:", selectedRecipe);
  }, [selectedRecipe]);
  const hasAdded = useRef(false);
  const navigate = useNavigate();

  const hasRecipe =
    selectedRecipe &&
    Array.isArray(selectedRecipe.steps) &&
    selectedRecipe.steps.length > 0;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [todayTasks, setTodayTasks] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // addRecipeToFirestore();
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    if (hasRecipe) {
      const progress = initialProgress || {};
      const stepIndex = progress.currentStep || 0;
      setCurrentStepIndex(stepIndex);

      const stepTasks = selectedRecipe.steps[stepIndex].tasks.map((t, i) => ({
        title: t,
        done: progress.taskStates ? progress.taskStates[i] : false,
      }));

      setTodayTasks(stepTasks);
    }
  }, [hasRecipe, selectedRecipe, initialProgress]);

  const currentStep = hasRecipe
    ? selectedRecipe.steps[currentStepIndex]
    : { title: "", tasks: [] };

  const totalTasks = currentStep.tasks.length;
  const doneTasks = todayTasks.filter((t) => t.done).length;
  const innerPercent =
    totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const isLastStep = currentStepIndex === selectedRecipe?.steps?.length - 1;
  const allDone = todayTasks.every((t) => t.done);
  const outerPercent = !hasRecipe
    ? 0
    : isLastStep && allDone
    ? 100
    : Math.floor((currentStepIndex / selectedRecipe.steps.length) * 100);

  const saveProgress = async (recipeId, stepIndex, taskStates) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      [`progress.${recipeId}`]: {
        currentStep: stepIndex,
        taskStates: taskStates,
      },
    });
  };

  const handleToggle = (index) => {
    const updated = [...todayTasks];
    updated[index].done = !updated[index].done;
    setTodayTasks(updated);
    saveProgress(
      selectedRecipe.id,
      currentStepIndex,
      updated.map((t) => t.done)
    );
  };

  useEffect(() => {
    if (!hasRecipe || initialProgress) return;

    const tasks = selectedRecipe.steps[currentStepIndex].tasks.map((t) => ({
      title: t,
      done: false,
    }));
    setTodayTasks(tasks);
    saveProgress(
      selectedRecipe.id,
      currentStepIndex,
      tasks.map((t) => t.done)
    );
  }, [hasRecipe, currentStepIndex, selectedRecipe, initialProgress]);

  useEffect(() => {
    if (!hasRecipe) return;

    const allDone = todayTasks.length > 0 && todayTasks.every((t) => t.done);
    const hasNext = currentStepIndex < selectedRecipe.steps.length - 1;

    if (allDone && hasNext) {
      setTimeout(() => {
        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);

        const nextTasks = selectedRecipe.steps[nextStepIndex].tasks.map(
          (t) => ({
            title: t,
            done: false,
          })
        );
        setTodayTasks(nextTasks);
        saveProgress(
          selectedRecipe.id,
          nextStepIndex,
          nextTasks.map((t) => t.done)
        );
      }, 800);
    }
  }, [todayTasks, currentStepIndex, selectedRecipe, hasRecipe]);

  return (
    <div className="home">
      <header>
        <h1>あなたの進捗状況</h1>
      </header>

      <div className="homeContainer">
        {hasRecipe ? (
          <>
            <h2>{selectedRecipe.title}</h2>
            <ProgressCircle
              outerPercent={outerPercent}
              innerPercent={innerPercent}
            />

            <div className="homeNextStep">
              <p className="homeNextStepTag">現在のステップ</p>
              <p className="homeNextStepText">{currentStep.title}</p>
            </div>

            <div className="homeTask">
              <p className="homeTaskTag">本日のタスク</p>
              <ul className="homeTaskList">
                {todayTasks.map((task, i) => (
                  <li
                    className="homeTaskItem"
                    key={i}
                    onClick={() => handleToggle(i)}
                    style={{ cursor: "pointer" }}
                  >
                    {task.done ? "☑" : "☐"} {task.title}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <h2>現在進行中のレシピはありません。</h2>
        )}

        <div className="homeStreak">
          <p className="homeStreakTag">連続継続日数</p>
          <div className="homeStreakVisual">
            <img src="fire.png" alt="streak" />
            <p className="homeStreakDate">10日</p>
          </div>
        </div>
      </div>

      <footer>
        <div className="footerNav">
          <Link to="/" className="footerNavItem active">
            <HomeFilledIcon />
            <p className="footerNavItemText">ホーム</p>
          </Link>
          <Link to="/recipes" className="footerNavItem">
            <DescriptionIcon />
            <p className="footerNavItemText">レシピ</p>
          </Link>
          <Link to="/profile/:id" className="footerNavItem">
            <PersonIcon />
            <p className="footerNavItemText">マイページ</p>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Main;