import React, { useEffect, useState } from "react";
import "./Recipes.scss";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]); // 🔸 レシピを保存するステート
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const getRecipes = async () => {
      const snapshot = await getDocs(collection(db, "recipes")); // ← 'recipe' → 'recipes' に合わせる
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(data);
      setLoading(false);
    };
    getRecipes();
  }, []);

  return (
    <div className="recipes">
      <header>
        <h1>みんなのレシピ</h1>
      </header>

      <div className="recipeContainer">
        <div className="recipeSearch">
          <input type="text" placeholder="レシピを検索" />
        </div>

        <div className="recipeInfo">
          <p className="count">
            <span className="number">{recipes.length}</span>
            <span className="unit">件</span>
          </p>
          <div className="recipeSort">
            <SwapVertIcon />
            <p>新着順</p>
          </div>
        </div>

        <div className="recipeList">
          {loading ? (
            <p>レシピを読み込んでいます...</p>
          ) : (
            <ul>
              {recipes.map((recipe) => (
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
                        <p className="recipeItemTime">期間: {recipe.duration}</p>
                        <p className="recipeItemTag">
                          {recipe.tag &&
                            recipe.tag.map((t, index) => (
                              <span key={index}>#{t} </span>
                            ))}
                        </p>
                      </div>
                    </Link>

                    <div className="recipeItemInfo">
                      <Link to="/profile/:id" className="userLink">
                        <div className="userInfo">
                          <img
                            className="userIcon"
                            src="/images/userIcon.png"
                            alt="プロフィール画像"
                          />
                          <h2 className="userName">リョウ</h2>
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
