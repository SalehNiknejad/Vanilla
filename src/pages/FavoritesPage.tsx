import { recipes } from "../lib/mockData";

export default function FavoritesPage() {
  const favorites = recipes.filter((recipe) => recipe.favorite);

  return (
    <main className="shell space-y-6 pb-28">
      <section className="card p-5">
        <h2 className="text-3xl font-black text-[#352a2b]">علاقه‌مندی‌ها</h2>
        <p className="mt-2 text-[#7c5f64]">
          غذاهایی که بیشتر از همه دوست داری.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {favorites.map((recipe) => (
          <article key={recipe.id} className="card overflow-hidden">
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="h-48 w-full object-cover"
            />
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-[#382d2d]">
                  {recipe.title}
                </h3>
                <span className="text-xl text-[#d96276]">♥</span>
              </div>
              <p className="text-sm text-[#726363]">{recipe.description}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
