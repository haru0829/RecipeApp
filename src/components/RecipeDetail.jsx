import React, { useEffect, useState } from "react";
import "./RecipeDetail.scss";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StairsIcon from "@mui/icons-material/Stairs";
import PeopleIcon from "@mui/icons-material/People";
import { Link, useNavigate, useParams } from "react-router-dom";
import { updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const RecipeDetail = ({ setSelectedRecipe }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);

  const user = auth.currentUser;
  const isMyRecipe = user && recipe && recipe.authorId === user.uid;

  // Firestoreから1件のレシピを取得
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchRecipe = async () => {
      const docRef = doc(db, "recipes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRecipe({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.error("❌ レシピが見つかりません");
      }
    };

    fetchRecipe();
  }, [id]);

  const saveSelectedRecipeId = async (recipeId) => {
    const user = auth.currentUser;
    if (!user || !recipe) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      selectedRecipeId: recipeId,
      progress: {
        currentStep: 0,
        taskStates: recipe.steps[0].tasks.map(() => false),
      },
    });
  };

  const handleStart = async () => {
    await saveSelectedRecipeId(recipe.id);
    setSelectedRecipe(recipe); // 🔴 ここで即座にAppの状態を更新
    navigate("/"); // 🔁 画面遷移
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm("本当にこのレシピを削除しますか？")) {
      try {
        await deleteDoc(doc(db, "recipes", recipeId));
        alert("レシピを削除しました！");
        navigate("/recipes");
      } catch (error) {
        console.error("レシピ削除エラー:", error);
        alert("削除に失敗しました。もう一度お試しください。");
      }
    }
  };

  if (!recipe) return <div>読み込み中...</div>;

  return (
    <div className="recipeDetail">
      <div className="header">
        <Link to="/recipes">
          <ArrowBackIosNewIcon className="back-btn" />
        </Link>
        <img src={recipe.image} alt="レシピヘッダー画像" />
        <div className="btns">
          {isMyRecipe && (
            <div className="btns">
              <button
                className="edit-btn"
                onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
              >
                編集
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDeleteRecipe(recipe.id)}
              >
                削除
              </button>
            </div>
          )}
        </div>
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
        {recipe.steps.map((step, index) => (
          <div className="step" key={index}>
            <div className="stepper">
              <div className="stepper-circle">{index + 1}</div>
              <div className="stepper-line"></div>
            </div>
            <div className="step-content">
              <h2>{step.title}</h2>
              <ul>
                {step.tasks.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
              <p>{step.point}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        className="startBtn"
        onClick={async () => {
          await saveSelectedRecipeId(recipe.id);
          handleStart();
        }}
      >
        このレシピを始める
      </button>
    </div>
  );
};

export default RecipeDetail;
