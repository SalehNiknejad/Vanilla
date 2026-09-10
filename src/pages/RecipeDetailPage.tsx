import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRecipeBySlug } from "../lib/data";
import { Recipe } from "../types";

export default function RecipeDetailPage() {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!slug) return;
    void fetchRecipeBySlug(slug).then(setRecipe);
  }, [slug]);

  if (!recipe) {
    return <main className="shell pb-28">در حال بارگذاری...</main>;
  }

  return (
    <main className="shell pb-28">
      <article className="overflow-hidden rounded-[32px] border border-[#f2e1e5] bg-white/85 shadow-soft">
        <div className="relative">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-72 w-full object-cover md:h-[420px]"
          />
          <button className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-2xl shadow-soft">
            ♥
          </button>
        </div>

        <div className="space-y-6 p-5 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="pill mb-3">{recipe.cuisine}</p>
              <h1 className="text-3xl font-black text-[#352a2b] md:text-5xl">
                {recipe.title}
              </h1>
            </div>
            <button className="btn-primary">♡ ذخیره در علاقه‌مندی‌ها</button>
          </div>

          <p className="max-w-3xl text-base leading-8 text-[#6b5357]">
            {recipe.description}
          </p>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {[
              ["⏱️", `${recipe.prepTime + recipe.cookTime} دقیقه`],
              ["🍴", `${recipe.servings} نفر`],
              ["⚙️", recipe.difficulty],
              ["👩‍🍳", recipe.author],
            ].map(([icon, value]) => (
              <div
                key={value}
                className="rounded-2xl border border-[#f4e1e5] bg-[#fff8fa] p-4 text-center"
              >
                <div className="text-2xl">{icon}</div>
                <p className="mt-2 text-sm font-semibold text-[#514244]">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.25fr]">
            <section className="rounded-[28px] border border-[#f3e1e5] bg-[#fffefc] p-5">
              <h3 className="mb-4 text-2xl font-black text-[#382d2d]">
                مواد اولیه
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-[#fff5f7] px-3 py-3"
                  >
                    <span className="font-semibold text-[#4d3a3d]">
                      {ingredient.ingredientName}
                    </span>
                    <span className="text-sm text-[#7a6366]">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[28px] border border-[#f3e1e5] bg-[#fffefc] p-5">
              <h3 className="mb-4 text-2xl font-black text-[#382d2d]">
                مراحل پخت
              </h3>
              <div className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex gap-4 rounded-2xl bg-[#fff8fa] p-4"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f9dfe5] font-black text-[#b65f71]">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <p className="mb-1 font-bold text-[#473536]">
                        {step.title}
                      </p>
                      <p className="text-[#634d52]">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
