import React, { useState, useEffect, useRef } from "react";
import "./Home.scss";
import ProgressCircle from "./ProgressCircle";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { addRecipeToFirestore } from "../AddRecipe";

const Main = ({ selectedRecipe }) => {
  const hasAdded = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!hasAdded.current) {
      addRecipeToFirestore();
      hasAdded.current = true;
    }
  }, []);

  const hasRecipe =
    selectedRecipe &&
    Array.isArray(selectedRecipe.steps) &&
    selectedRecipe.steps.length > 0;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [todayTasks, setTodayTasks] = useState([]);

  // 現在のステップ
  const currentStep = hasRecipe
    ? selectedRecipe.steps[currentStepIndex]
    : { title: "", tasks: [] };

  // 本日の進捗
  const totalTasks = currentStep.tasks.length;
  const doneTasks = todayTasks.filter((t) => t.done).length;
  const innerPercent =
    totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  // 全体進捗（100%対応）
  const isLastStep = currentStepIndex === selectedRecipe?.steps?.length - 1;
  const allDone = todayTasks.every((t) => t.done);
  const outerPercent = !hasRecipe
    ? 0
    : isLastStep && allDone
    ? 100
    : Math.floor((currentStepIndex / selectedRecipe.steps.length) * 100);

  const handleToggle = (index) => {
    const updated = [...todayTasks];
    updated[index].done = !updated[index].done;
    setTodayTasks(updated);
  };

  // 初期化またはステップ更新時に todayTasks を設定
  useEffect(() => {
    if (hasRecipe) {
      const tasks = selectedRecipe.steps[currentStepIndex].tasks.map((t) => ({
        title: t,
        done: false,
      }));
      setTodayTasks(tasks);
    }
  }, [hasRecipe, currentStepIndex, selectedRecipe]);

  // 全部完了したら自動で次へ
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
