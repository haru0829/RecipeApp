import React, { useEffect } from "react";
import "./Home.scss";
import ProgressCircle from "./ProgressCircle";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { useRecipeProgress } from "../hooks/useRecipeProgress"; // ✅ 追加

const Main = ({ selectedRecipe, isAuth, initialProgress }) => {
  const navigate = useNavigate();

  const {
    currentStepIndex,
    setCurrentStepIndex,
    todayTasks,
    setTodayTasks,
    isFinished,
    setIsFinished,
    saveProgress,
  } = useRecipeProgress(selectedRecipe, initialProgress);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  const currentStep = selectedRecipe?.steps?.[currentStepIndex] || {
    title: "",
    tasks: [],
  };

  const totalTasks = currentStep.tasks.length;
  const doneTasks = todayTasks.filter((t) => t.done).length;
  const innerPercent =
    totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const isLastStep =
    currentStepIndex === (selectedRecipe?.steps?.length || 0) - 1;
  const allDone = todayTasks.length > 0 && todayTasks.every((t) => t.done);

  const outerPercent = !selectedRecipe
    ? 0
    : isFinished
    ? 100
    : Math.floor((currentStepIndex / selectedRecipe.steps.length) * 100);

  const handleToggle = (index) => {
    const updatedTasks = [...todayTasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    setTodayTasks(updatedTasks);
    saveProgress(
      currentStepIndex,
      updatedTasks.map((t) => t.done)
    );
  };

  useEffect(() => {
    if (!selectedRecipe) return;

    if (allDone) {
      if (isLastStep) {
        setIsFinished(true);
      } else {
        setTimeout(() => {
          const nextStepIndex = currentStepIndex + 1;
          setCurrentStepIndex(nextStepIndex);

          const nextTasks = selectedRecipe.steps[nextStepIndex].tasks.map(
            (task) => ({
              title: task,
              done: false,
            })
          );

          setTodayTasks(nextTasks);
          saveProgress(
            nextStepIndex,
            nextTasks.map(() => false)
          );
        }, 800);
      }
    }
  }, [allDone, isLastStep, selectedRecipe]);

  return (
    <div className="home">
      <header>
        <h1>あなたの進捗状況</h1>
      </header>

      <div className="homeContainer">
        {!selectedRecipe ? (
          <h2>まずはレシピを選んでみましょう。</h2>
        ) : (
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
                    key={i}
                    className="homeTaskItem"
                    onClick={() => handleToggle(i)}
                    style={{ cursor: "pointer" }}
                  >
                    {task.done ? "☑" : "☐"} {task.title}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
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
