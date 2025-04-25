import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "./components/Home";
import Recipes from "./components/Recipes";
import RecipeDetail from "./components/RecipeDetail";
import Profile from "./components/Profile";
import Login from "./components/Login";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // ✅ ログイン状態をlocalStorageから復元
  useEffect(() => {
    const auth = localStorage.getItem("isAuth");
    if (auth === "true") {
      setIsAuth(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuth ? (
              <Home selectedRecipe={selectedRecipe} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/recipes" element={<Recipes />} />
        <Route
          path="/recipe-detail/:id"
          element={<RecipeDetail setSelectedRecipe={setSelectedRecipe} />}
        />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
      </Routes>
    </Router>
  );
}

export default App;
