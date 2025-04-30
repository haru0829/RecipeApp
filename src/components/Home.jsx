import React, { useEffect, useState } from "react";
import "./Home.scss";
import ProgressCircle from "./ProgressCircle";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link, useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { useRecipeProgress } from "../hooks/useRecipeProgress";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const Main = ({ selectedRecipe, isAuth }) => {
  const navigate = useNavigate();

  const [initialProgress, setInitialProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!selectedRecipe || !auth.currentUser) {
        setLoading(false); // ← これも忘れずに
        return;
      }

      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setInitialProgress(data.progress || {});
      }

      setProgressLoaded(true);
      setLoading(false); // ✅ ここを忘れていた！
    };

    fetchProgress();
  }, [selectedRecipe]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isAuth) {
      navigate("/login");
    }
  }, [isAuth, navigate]);

  const {
    currentStepIndex,
    setCurrentStepIndex,
    todayTasks,
    setTodayTasks,
    isFinished,
    setIsFinished,
    saveProgress,
  } = useRecipeProgress(
    selectedRecipe,
    progressLoaded ? initialProgress : null
  );

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
  
    const completedKey = `completed-${selectedRecipe.id}`;
    const alreadyShown = sessionStorage.getItem(completedKey);
  
    if (allDone) {
      if (isLastStep) {
        if (!alreadyShown) {
          setIsFinished(true);
          setShowCompletionModal(true);
          sessionStorage.setItem(completedKey, "true"); // 🔒 表示済みフラグ保存
        }
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
  

  if (loading) return <p>読み込み中...</p>;

  const handleNoteChange = (index, newNote) => {
    const updatedTasks = [...todayTasks];
    updatedTasks[index].note = newNote;
    setTodayTasks(updatedTasks);

    // 保存処理：完了状態とノートの両方
    saveProgress(
      currentStepIndex,
      updatedTasks.map((t) => t.done),
      updatedTasks.map((t) => t.note)
    );
  };

  return (
    <div className="home">
      {showCompletionModal && (
        <div className="completionModal">
          <div className="completionModalContent">
            <h2>🎉 完了！</h2>
            <p>このレシピをすべて達成しました！</p>
            <button onClick={() => setShowCompletionModal(false)}>
              閉じる
            </button>
          </div>
        </div>
      )}

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
              <p className="homeTaskTag">タスク</p>
              <ul className="homeTaskList">
                {todayTasks.map((task, i) => (
                  <li key={i} className="homeTaskItem">
                    <div
                      onClick={() => handleToggle(i)}
                      style={{ cursor: "pointer" }}
                    >
                      {task.done ? "☑" : "☐"} {task.title}
                    </div>

                    <textarea
                      className="taskNote"
                      placeholder="今日やる範囲やメモを記入..."
                      value={task.note || ""}
                      onChange={(e) => handleNoteChange(i, e.target.value)}
                    />
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
          <Link
            to={`/profile/${auth.currentUser?.uid}`}
            className="footerNavItem"
          >
            <PersonIcon />
            <p className="footerNavItemText">マイページ</p>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Main;
