import React from "react";
import "./Recipes.scss";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link } from "react-router-dom";
import { recipes } from "../data/RecipeData";
import PersonIcon from "@mui/icons-material/Person";

// import SearchIcon from '@mui/icons-material/Search';

const Recipes = () => {
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
          <p>214件</p>
          <div className="recipeSort">
            <SwapVertIcon />
            <p>新着順</p>
          </div>
        </div>
        <div className="recipeList">
          <ul>
            {recipes.map((recipe) => (
              <li className="recipeItem" key={recipe.id}>
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
                      {recipe.tag.map((t, index) => (
                        <span key={index}>#{t} </span>
                      ))}
                    </p>
                    <div className="recipeItemInfo">
                      <div className="userInfo">
                        <img
                          className="userIcon"
                          src="/images/userIcon.png"
                          alt="プロフィール画像"
                        />
                        <h2 className="userName">リョウ</h2>
                      </div>
                      <p className="recipeStar">★ 4.7</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
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
