import React, { useState, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Recipes from "./components/Recipes";
import RecipeDetail from "./components/RecipeDetail";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Main from "./components/Home";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [initialProgress, setInitialProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuth(true);
        localStorage.setItem("isAuth", "true");

        // 🔄 Firestoreからユーザー情報取得
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;

        const userData = userSnap.data();
        const recipeId = userData.selectedRecipeId;

        if (recipeId) {
          const recipeRef = doc(db, "recipes", recipeId);
          const recipeSnap = await getDoc(recipeRef);
          if (recipeSnap.exists()) {
            setSelectedRecipe({ id: recipeId, ...recipeSnap.data() });
            if (userData.progress && userData.progress[recipeId]) {
              setInitialProgress(userData.progress[recipeId]);
            }
          }
        }
      } else {
        setIsAuth(false);
        localStorage.removeItem("isAuth");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuth ? (
                <Main
                  selectedRecipe={selectedRecipe}
                  isAuth={isAuth}
                  initialProgress={initialProgress}
                />
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
