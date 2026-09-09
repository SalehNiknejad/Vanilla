import { ingredients } from "../lib/mockData";

export default function IngredientsPage() {
  return (
    <main className="shell space-y-6 pb-28">
      <section className="card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-[#9a6b76]">Ingredient Explorer</p>
            <h2 className="text-3xl font-black text-[#352a2b]">مواد اصلی</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#f3dfe4] bg-[#fff8fa] px-4 py-3 md:min-w-[280px]">
            <span>🔎</span>
            <input
              aria-label="Search ingredients"
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-[#8d7277]"
              placeholder="جستجوی ماده"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {ingredients.map((ingredient) => (
          <button
            key={ingredient.id}
            className="card flex flex-col items-center gap-3 p-5 text-center transition hover:-translate-y-1 hover:shadow-card"
          >
            <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#fff0f3] to-[#f5e9de] text-3xl">
              {ingredient.emoji}
            </div>
            <div>
              <p className="text-lg font-bold text-[#433538]">
                {ingredient.name}
              </p>
              <p className="text-xs text-[#8d7277]">
                {ingredient.category ?? "مواد پخت"}
              </p>
            </div>
          </button>
        ))}
      </section>
    </main>
  );
}
