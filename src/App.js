import Home from './components/Home';
import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom"
import Recipes from './components/Recipes';
import RecipeDetail from './components/RecipeDetail';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe-detail/:id" element={<RecipeDetail />} />
        </Routes>
      </Router>
  );
}


export default App;
