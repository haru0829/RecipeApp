import Home from "./components/Home";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Recipes from "./components/Recipes";
import RecipeDetail from "./components/RecipeDetail";
import { useState } from "react";
import Profile from "./components/Profile";

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home selectedRecipe={selectedRecipe} />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route
          path="/recipe-detail/:id"
          element={<RecipeDetail setSelectedRecipe={setSelectedRecipe} />}
        />
        <Route
          path="/profile/:id"
          element={<Profile />}
        />
      </Routes>
    </Router>
  );
}

export default App;
