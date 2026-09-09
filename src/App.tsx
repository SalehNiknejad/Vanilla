import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import RecipesPage from "./pages/RecipesPage";
import IngredientsPage from "./pages/IngredientsPage";
import FavoritesPage from "./pages/FavoritesPage";
import CreateRecipePage from "./pages/CreateRecipePage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:slug" element={<RecipeDetailPage />} />
        <Route path="/ingredients" element={<IngredientsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/create" element={<CreateRecipePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}

export default App;
