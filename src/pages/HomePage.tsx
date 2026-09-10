import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RecipeCard } from "../components/RecipeCard";
import { fetchCategories, fetchIngredients, fetchRecipes } from "../lib/data";
import { Category, Ingredient, Recipe } from "../types";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    void (async () => {
      const [categoryData, ingredientData, recipeData] = await Promise.all([
        fetchCategories(),
        fetchIngredients(),
        fetchRecipes(),
      ]);

      setCategories(categoryData);
      setIngredients(ingredientData);
      setRecipes(recipeData);
    })();
  }, []);

  return (
    <main className="shell space-y-8 pb-28">
      <section className="card overflow-hidden p-5 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-4">
            <p className="pill w-fit">✨ امروز چی بپزم؟</p>
            <h2 className="text-3xl font-black leading-tight text-[#2d2324] md:text-5xl">
              چی داری، چه چیزی می‌تونی درست کنی؟
            </h2>
            <div className="flex items-center gap-3 rounded-full border border-[#f0dfe3] bg-[#fff8fa] px-4 py-3 shadow-sm">
              <span className="text-xl">🔎</span>
              <input
                aria-label="Search recipes"
                className="w-full border-0 bg-transparent text-sm text-[#4d3a3d] outline-none placeholder:text-[#9b7a80]"
                placeholder="جستجوی دستور پخت، مواد یا سبک غذا"
              />
            </div>
          </div>

          <div className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f9dfe3] via-[#fff5f8] to-[#f4e6d6] p-4 shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80"
              alt="Recipe hero"
              className="h-64 w-full rounded-[22px] object-cover"
            />
            <div className="absolute bottom-7 left-7 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-[#5b3a41]">
              انتخاب بر اساس مواد موجود
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-[#362c2d]">دسته‌بندی‌ها</h3>
          <Link to="/recipes" className="text-sm font-semibold text-[#b85f73]">
            مشاهده همه
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="card flex flex-col items-center gap-3 p-4 text-center transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#ffeef1] to-[#f7e7e0] text-3xl">
                {category.emoji}
              </div>
              <span className="font-bold text-[#473536]">{category.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-[#362c2d]">مواد موجود</h3>
          <span className="text-sm text-[#7d5f65]">انتخاب چندتایی</span>
        </div>

        <div className="-mx-1 flex gap-3 overflow-x-auto pb-2">
          {ingredients.slice(0, 8).map((ingredient) => (
            <button
              key={ingredient.id}
              className="card min-w-[110px] shrink-0 p-3 text-center transition hover:-translate-y-1"
            >
              <div className="mb-2 text-3xl">{ingredient.emoji}</div>
              <div className="text-sm font-semibold text-[#4b3437]">
                {ingredient.name}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black text-[#362c2d]">
            دستورهای پیشنهادی
          </h3>
          <Link to="/recipes" className="text-sm font-semibold text-[#b85f73]">
            همه‌ی غذاها
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </section>
    </main>
  );
}
