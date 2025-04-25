import React, { useState, useEffect } from "react";
import "./Home.scss";
import ProgressCircle from "./ProgressCircle";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";

const Main = ({ selectedRecipe, isAuth, initialProgress }) => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [todayTasks, setTodayTasks] = useState([]);

  // ページロード時の処理
  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  // レシピと進捗データの初期設定
  useEffect(() => {
    if (!selectedRecipe || !Array.isArray(selectedRecipe.steps)) return;

    const progress = initialProgress || {};
    const stepIndex = progress.currentStep || 0;

    // ステップ範囲外なら0にリセット
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
  }, [selectedRecipe, initialProgress]);

  // 現在のステップ情報
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
    : isLastStep && allDone
    ? 100
    : Math.floor((currentStepIndex / selectedRecipe.steps.length) * 100);

  // 進捗保存関数
  const saveProgress = async (stepIndex, taskStates) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      progress: {
        currentStep: stepIndex,
        taskStates: taskStates,
      },
    });
  };

  // タスクのチェックを切り替え
  const handleToggle = (index) => {
    const updatedTasks = [...todayTasks];
    updatedTasks[index].done = !updatedTasks[index].done;
    setTodayTasks(updatedTasks);

    saveProgress(
      currentStepIndex,
      updatedTasks.map((t) => t.done)
    );
  };

  // 全タスク完了したら次のステップへ
  useEffect(() => {
    if (!selectedRecipe) return;
    if (allDone && !isLastStep) {
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
          nextTasks.map((t) => t.done)
        );
      }, 800);
    }
  }, [allDone, currentStepIndex, selectedRecipe, isLastStep]);

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
