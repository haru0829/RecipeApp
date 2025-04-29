import React, { useEffect, useState } from "react";
import "./Recipes.scss";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { deleteDoc, doc } from "firebase/firestore";
import "./RecipeCard.scss";
import AddIcon from "@mui/icons-material/Add";

const Recipes = () => {
  //状態変数定義
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("new"); // 'new' または 'popular'
  const [searchTerm, setSearchTerm] = useState("");
  const [recipesLength, setRecipesLength] = useState(0);

  //全レシピ取得
  useEffect(() => {
    const getRecipes = async () => {
      const snapshot = await getDocs(collection(db, "recipes"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(data);
      setLoading(false);
    };
    getRecipes();
  }, []);

  //並び替え処理
  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortType === "new") {
      return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    } else if (sortType === "popular") {
      return (parseInt(b.people) || 0) - (parseInt(a.people) || 0);
    }
    return 0;
  });

  //検索処理
  const filteredRecipes = sortedRecipes.filter((recipe) => {
    const titleMatch = recipe.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const tagMatch = recipe.tag?.some((t) =>
      t.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return titleMatch || tagMatch;
  });

  //検索結果件数
  useEffect(() => {
    setRecipesLength(filteredRecipes.length);
  }, [filteredRecipes]);

  //レシピ削除
  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm("本当にこのレシピを削除しますか？")) {
      try {
        await deleteDoc(doc(db, "recipes", recipeId));
        alert("レシピを削除しました！");
        // 削除後にレシピリストをリロードするならここでfetchする
      } catch (error) {
        console.error("レシピ削除エラー:", error);
        alert("削除に失敗しました。もう一度お試しください。");
      }
    }
  };

  return (
    <div className="recipes">
      <header>
        <h1>みんなのレシピ</h1>
      </header>

      <div className="recipeContainer">
        <Link className="add-btn" to="/create-recipe">
          <AddIcon />
        </Link>
        <div className="recipeSearch">
          <input
            type="text"
            placeholder="レシピを検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="recipeInfo">
          <p className="count">
            <span className="number">{recipesLength}</span>
            <span className="unit">件</span>
          </p>
          <div className="recipeSortButtons">
            <button
              className={`sortBtn ${sortType === "new" ? "active" : ""}`}
              onClick={() => setSortType("new")}
            >
              新着順
            </button>
            <button
              className={`sortBtn ${sortType === "popular" ? "active" : ""}`}
              onClick={() => setSortType("popular")}
            >
              人気順
            </button>
          </div>
        </div>

        <div className="recipeList">
          {loading ? (
            <p>レシピを読み込んでいます...</p>
          ) : (
            <ul>
              {filteredRecipes.map((recipe) => (
                <li className="recipeItem" key={recipe.id}>
                  <div className="recipeItemWrapper">
                    <Link to={`/recipe-detail/${recipe.id}`}>
                      <img
                        src={recipe.image}
                        alt=""
                        className="recipeItemImg"
                      />

                      <div className="recipeItemContent">
                        <p className="recipeItemTtl">{recipe.title}</p>
                        <p className="recipeItemPps">目的: {recipe.purpose}</p>
                        <p className="recipeItemTime">
                          期間: {recipe.duration}
                        </p>
                        <p className="recipeItemTag">
                          {recipe.tag &&
                            recipe.tag.map((t, index) => (
                              <span key={index}>#{t} </span>
                            ))}
                        </p>
                      </div>
                    </Link>

                    <div className="recipeItemInfo">
                      <Link
                        to={`/profile/${recipe.authorId}`}
                        className="userLink"
                      >
                        <div className="userInfo">
                          <img
                            className="userIcon"
                            src={
                              recipe.authorImage || "/images/defaultIcon.png"
                            } // 🔥
                            alt="プロフィール画像"
                          />
                          <h2 className="userName">
                            {recipe.authorName || "匿名ユーザー"}
                          </h2>{" "}
                          {/* 🔥 */}
                        </div>
                      </Link>
                      <p className="recipeStar">★ 4.7</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <footer>
        <div className="footerNav">
          <Link to="/" className="footerNavItem">
            <HomeFilledIcon />
            <p className="footerNavItemText">ホーム</p>
          </Link>
          <Link to="/recipes" className="footerNavItem active">
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

export default Recipes;
