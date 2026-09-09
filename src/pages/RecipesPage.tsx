import { recipes } from "../lib/mockData";
import { RecipeCard } from "../components/RecipeCard";

export default function RecipesPage() {
  return (
    <main className="shell space-y-6 pb-28">
      <section className="card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-[#9a6b76]">
              فیلترهای هوشمند
            </p>
            <h2 className="text-3xl font-black text-[#352a2b]">
              همه‌ی دستورها
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["زیر ۳۰ دقیقه", "مرغ", "ایرانی", "صبحانه"].map((filter) => (
              <span key={filter} className="pill">
                {filter}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </section>
    </main>
  );
}
