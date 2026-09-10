import { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { supabase } from "./lib/supabase";
import HomePage from "./pages/HomePage";
import RecipesPage from "./pages/RecipesPage";
import IngredientsPage from "./pages/IngredientsPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import CreateRecipePage from "./pages/CreateRecipePage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";

function ProtectedRoute() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsAuthenticated(Boolean(data.session));
      setIsReady(true);
    };

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setIsAuthenticated(Boolean(session));
      setIsReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#5a4446]">
        در حال بررسی دسترسی...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}

function AuthRoute() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsAuthenticated(Boolean(data.session));
      setIsReady(true);
    };

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setIsAuthenticated(Boolean(session));
      setIsReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[#5a4446]">
        در حال آماده‌سازی...
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />;
}

function App() {
  return (
    <div dir="rtl" lang="fa">
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:slug" element={<RecipeDetailPage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/create" element={<CreateRecipePage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="/auth" element={<AuthRoute />} />
      </Routes>
    </div>
  );
}

export default App;
