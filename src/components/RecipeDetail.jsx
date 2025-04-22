import React from "react";
import "./RecipeDetail.scss";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StairsIcon from "@mui/icons-material/Stairs";
import PeopleIcon from "@mui/icons-material/People";
import { Link, useParams } from "react-router-dom";
import { recipes } from "../data/RecipeData";


const RecipeDetail = () => {
  const { id } = useParams();
  const recipe = recipes.find((r) => r.id === id);

  return (
    <div className="recipeDetail">
      <div className="header">
        <Link to="/recipes">
          <ArrowBackIosNewIcon className="back-btn" />
        </Link>
        <img src={recipe.image} alt="レシピヘッダー画像" />
      </div>

      <div className="content">
        <h1>{recipe.title}</h1>
        <div className="meta">
          <AccessTimeIcon />
          <span>{recipe.duration}</span>
          <StairsIcon />
          <span>{recipe.steps.length}ステップ</span>
          <PeopleIcon />
          <span>{recipe.people}人</span>
        </div>
        <p className="desc">{recipe.description}</p>
      </div>

      <div className="steps">
        {recipe.steps.map((step, index) => {
          return (
            <div className="step">
              <div className="stepper">
                <div className="stepper-circle">{index + 1}</div>
                <div className="stepper-line"></div>
              </div>
              <div className="step-content">
                <h2>{step.title}</h2>
                <ul>
                  {step.tasks.map((task) => (
                    <li>{task}</li>
                  ))}
                </ul>
                <p>{step.point}</p>
              </div>
            </div>
          );
        })}
      </div>
      <button className="startBtn">このレシピを始める</button>
    </div>
  );
};

export default RecipeDetail;
