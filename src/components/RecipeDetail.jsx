import React from "react";
import "./RecipeDetail.scss";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StairsIcon from "@mui/icons-material/Stairs";
import PeopleIcon from "@mui/icons-material/People";
import { Link, useNavigate, useParams } from "react-router-dom";
import { recipes } from "../data/RecipeData";
import { useEffect } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";

const RecipeDetail = ({ setSelectedRecipe }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { id } = useParams();
  const navigate = useNavigate();

  const recipe = recipes.find((r) => r.id === id);

  const handleStart = () => {
    setSelectedRecipe(recipe);
    navigate("/");
  };

  const saveSelectedRecipeId = async (recipeId) => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      selectedRecipeId: recipeId,
      progress: {
        currentStep: 0,
        taskStates: recipe.steps[0].tasks.map(() => false),
      },
    });
  };

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
      <button
        className="startBtn"
        onClick={async () => {
          await saveSelectedRecipeId(recipe.id); // 🔄 Firestoreに保存が先
          handleStart(); // 🔽 その後で状態更新して遷移
        }}
      >
        このレシピを始める
      </button>
    </div>
  );
};

export default RecipeDetail;
