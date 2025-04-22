import React from "react";
import "./Recipes.scss";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link } from "react-router-dom";
import { recipes } from "../data/RecipeData";


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
                  <p className="recipeItemTtl">{recipe.title}</p>
                  <p className="recipeItemPps">目的: {recipe.purpose}</p>
                  <p className="recipeItemTime">期間 : {recipe.duration}</p>
                  <p className="recipeItemTag">
                    {recipe.tag.map((t, index) => (
                      <span key={index}>#{t} </span>
                    ))}
                  </p>
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
        </div>
      </footer>
    </div>
  );
};

export default Recipes;
