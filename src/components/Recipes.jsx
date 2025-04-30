// Recipes.jsx
import React, { useEffect, useState } from "react";
import "./Recipes.scss";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import DescriptionIcon from "@mui/icons-material/Description";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import "./RecipeCard.scss";
import AddIcon from "@mui/icons-material/Add";
import { auth } from "../firebase";
import CategoryFilterModal from "./CategoryFilterModal";
import TuneIcon from "@mui/icons-material/Tune";
import LoadingSpinner from "./LoadingSpinner";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("new");
  const [searchTerm, setSearchTerm] = useState("");
  const [recipesLength, setRecipesLength] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const getRecipesWithAuthors = async () => {
      const snapshot = await getDocs(collection(db, "recipes"));
      const recipeData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const enrichedData = await Promise.all(
        recipeData.map(async (recipe) => {
          if (!recipe.authorId) return recipe;
          try {
            const userRef = doc(db, "users", recipe.authorId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const user = userSnap.data();
              return {
                ...recipe,
                authorName: user.name,
                authorImage: user.profileImage,
              };
            }
          } catch (err) {
            console.warn("プロフィール取得失敗:", err);
          }
          return recipe;
        })
      );

      setRecipes(enrichedData);
      setFilteredRecipes(enrichedData);
      setLoading(false);
    };

    getRecipesWithAuthors();
  }, []);

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortType === "new") {
      return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    } else if (sortType === "popular") {
      return (parseInt(b.people) || 0) - (parseInt(a.people) || 0);
    }
    return 0;
  });

  const filteredBySearch = sortedRecipes.filter((recipe) => {
    const titleMatch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    const tagMatch = recipe.tag?.some((t) =>
      t.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return titleMatch || tagMatch;
  });

  useEffect(() => {
    setRecipesLength(filteredBySearch.length);
  }, [filteredBySearch]);

  const handleDeleteRecipe = async (recipeId) => {
    if (window.confirm("本当にこのレシピを削除しますか？")) {
      try {
        await deleteDoc(doc(db, "recipes", recipeId));
        alert("レシピを削除しました！");
      } catch (error) {
        console.error("レシピ削除エラー:", error);
        alert("削除に失敗しました。もう一度お試しください。");
      }
    }
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleApply = () => {
    if (selectedCategories.length === 0) {
      setFilteredRecipes(recipes);
    } else {
      const result = recipes.filter((r) =>
        selectedCategories.includes(r.category)
      );
      setFilteredRecipes(result);
    }
    setIsFilterOpen(false);
  };

  return (
    <div className="recipes">
      {isFilterOpen && (
        <CategoryFilterModal
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
          onClear={() => setSelectedCategories([])}
          onApply={handleApply}
          onClose={() => setIsFilterOpen(false)}
          resultCount={
            selectedCategories.length === 0
              ? recipes.length
              : recipes.filter((r) => selectedCategories.includes(r.category)).length
          }
        />
      )}

      <header>
        <h1>みんなのレシピ</h1>
        <div className="recipeSearch">
          <input
            type="text"
            placeholder="レシピを検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setIsFilterOpen(true)}>
            <TuneIcon />
          </button>
        </div>
      </header>

      <div className="recipeContainer">
        <Link className="add-btn" to="/create-recipe">
          <AddIcon />
        </Link>

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
            <LoadingSpinner />
          ) : (
            <ul>
              {filteredBySearch.map((recipe) => (
                <li className="recipeItem" key={recipe.id}>
                  <div className="recipeItemWrapper">
                    <Link to={`/recipe-detail/${recipe.id}`}>
                      {recipe.image && (
                        <img
                          src={recipe.image}
                          alt=""
                          className="recipeItemImg"
                        />
                      )}
                      <div className="recipeItemContent">
                        <p className="recipeItemTtl">{recipe.title}</p>
                        {recipe.category && (
                          <span className={`recipeItemCategory category-${recipe.category}`}>
                            {recipe.category}
                          </span>
                        )}
                        <p className="recipeItemPps">
                          説明: {recipe.description}
                        </p>
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
                            }
                            alt="プロフィール画像"
                          />
                          <h2 className="userName">{recipe.authorName}</h2>
                        </div>
                      </Link>
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

export default Recipes;