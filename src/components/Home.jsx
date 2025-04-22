import React from "react";
import "./Home.scss";
import ProgressCircle from "./ProgressCircle";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link } from "react-router-dom";

const Main = ({ selectedRecipe }) => {
  if (
    !selectedRecipe ||
    !selectedRecipe.steps ||
    selectedRecipe.steps.length === 0
  ) {
    return (
      <div className="home">
        <header>
          <h1>あなたの進捗状況</h1>
        </header>

        <div className="homeContainer">
          <h2>現在進行中のレシピはありません。</h2>
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
          </div>
        </footer>
      </div>
    );
  }

  const currentStep = selectedRecipe.steps[0];

  const totalTasks = currentStep.tasks.length;
  const doneTasks = currentStep.tasks.filter((t) => t.done).length;
  const innerPercent =
    totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  return (
    <div className="home">
      <header>
        <h1>あなたの進捗状況</h1>
      </header>
      <div className="homeContainer">
        <h2>{selectedRecipe.title}</h2>
        <ProgressCircle
          outerPercent={
            (selectedRecipe.steps.indexOf(currentStep) /
              selectedRecipe.steps.length) *
            100
          }
          innerPercent={innerPercent}
        />
        <div className="homeNextStep">
          <p className="homeNextStepTag">現在のステップ</p>
          <p className="homeNextStepText">{currentStep.title}</p>
        </div>
        <div className="homeTask">
          <p className="homeTaskTag">本日のタスク</p>
          <ul className="homeTaskList">
            {currentStep.tasks.map((task, i) => (
              <li className="homeTaskItem" key={i}>
                ☐ {task}
              </li>
            ))}
          </ul>
        </div>
        <div className="homeStreak">
          <p className="homeStreakTag">連続継続日数</p>
          <div className="homeStreakVisual">
            <img src="fire.png" alt="" />
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
        </div>
      </footer>
    </div>
  );
};

export default Main;
