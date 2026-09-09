import { Link } from "react-router-dom";
import { Recipe } from "../types";

interface Props {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: Props) {
  return (
    <article className="card overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-card">
      <div className="relative">
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-52 w-full object-cover"
        />
        <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg shadow-sm backdrop-blur-sm">
          {recipe.favorite ? "♥" : "♡"}
        </button>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="pill">{recipe.cuisine}</span>
          <span className="text-xs text-[#866a70]">{recipe.difficulty}</span>
        </div>

        <div>
          <Link
            to={`/recipes/${recipe.slug}`}
            className="text-xl font-extrabold text-[#3b2d2d] hover:text-[#b55d70]"
          >
            {recipe.title}
          </Link>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#726363]">
            {recipe.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-[#7a6366]">
          <span>⏱️ {recipe.cookTime} دقیقه</span>
          <span>🍴 {recipe.categories[0] ?? "سفارش"}</span>
        </div>
      </div>
    </article>
  );
}
