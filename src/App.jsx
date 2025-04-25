import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Home from "./components/Home";
import Recipes from "./components/Recipes";
import RecipeDetail from "./components/RecipeDetail";
import Profile from "./components/Profile";
import Login from "./components/Login";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true); // 初期状態を保つためのフラグ

  // ✅ Firebase認証状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuth(true);
        localStorage.setItem("isAuth", "true");
      } else {
        setIsAuth(false);
        localStorage.removeItem("isAuth");
      }
      setLoading(false); // 認証チェック完了
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>; // 認証状態のチェック中に一時表示

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
