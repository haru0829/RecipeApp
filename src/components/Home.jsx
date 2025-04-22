import React from "react";
import "./Home.scss";
import ProgressCircle from "./ProgressCircle";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link } from "react-router-dom";
import { recipes } from "../data/RecipeData";
import { userProgress } from "../data/UserProgress";

const Main = () => {
  const recipe = recipes.find((r) => r.id === userProgress.recipeId);
  const current = recipe.steps[userProgress.currentStep];

  const totalTasks = current.tasks.length;
  const doneTasks = current.tasks.filter((t) => t.done).length;
  const innerPercent = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
  
  return (
    <div className="home">
      <header>
        <h1>あなたの進捗状況</h1>
      </header>
      <div className="homeContainer">
        <h2>{recipe.title}</h2>
        <ProgressCircle
          outerPercent={((userProgress.currentStep) / recipe.steps.length) * 100}
          innerPercent={innerPercent} // 本日の達成率など
        />

        <div className="homeNextStep">
          <p className="homeNextStepTag">現在のステップ</p>
          <p className="homeNextStepText">{current.title}</p>
        </div>
        <div className="homeTask">
          <p className="homeTaskTag">本日のタスク</p>
          <ul className="homeTaskList">
            {current.tasks.map((task, i) => (
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
