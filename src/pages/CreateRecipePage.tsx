import { FormEvent, useState } from "react";

type IngredientRow = {
  id: number;
  name: string;
  amount: string;
  unit: string;
};

const defaultIngredients: IngredientRow[] = [
  { id: 1, name: "مرغ", amount: "500", unit: "گرم" },
  { id: 2, name: "پیاز", amount: "2", unit: "عدد" },
  { id: 3, name: "گوجه", amount: "3", unit: "عدد" },
  { id: 4, name: "پنیر", amount: "100", unit: "گرم" },
];

const initialTags = ["صبحانه", "شام", "غذای برنجی", "سریع"];

export default function CreateRecipePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prepTime, setPrepTime] = useState("15");
  const [cookTime, setCookTime] = useState("25");
  const [servings, setServings] = useState("2");
  const [difficulty, setDifficulty] = useState("آسان");
  const [ingredients, setIngredients] =
    useState<IngredientRow[]>(defaultIngredients);
  const [steps, setSteps] = useState<string[]>([
    "پیاز را خرد کنید و تفت دهید.",
    "مرغ را اضافه کرده و هم بزنید.",
    "ادویه‌ها را اضافه کنید و سرو کنید.",
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>(["صبحانه"]);
  const [message, setMessage] = useState("");

  const updateIngredient = (
    id: number,
    field: "name" | "amount" | "unit",
    value: string,
  ) => {
    setIngredients((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const addIngredient = () => {
    setIngredients((current) => [
      ...current,
      {
        id: Date.now(),
        name: "",
        amount: "1",
        unit: "عدد",
      },
    ]);
  };

  const removeIngredient = (id: number) => {
    setIngredients((current) =>
      current.length > 1 ? current.filter((item) => item.id !== id) : current,
    );
  };

  const addStep = () => {
    setSteps((current) => [...current, ""]);
  };

  const updateStep = (index: number, value: string) => {
    setSteps((current) =>
      current.map((step, stepIndex) => (stepIndex === index ? value : step)),
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanIngredients = ingredients.filter((item) => item.name.trim());
    const cleanSteps = steps.filter((step) => step.trim());

    if (
      !title.trim() ||
      !description.trim() ||
      cleanIngredients.length === 0 ||
      cleanSteps.length === 0
    ) {
      setMessage("لطفاً عنوان، توضیح، حداقل یک ماده و یک مرحله را کامل کنید.");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      prepTime: Number(prepTime) || 0,
      cookTime: Number(cookTime) || 0,
      servings: Number(servings) || 1,
      difficulty,
      ingredients: cleanIngredients,
      steps: cleanSteps,
      tags: selectedTags,
    };

    console.log("Create recipe payload:", payload);
    setMessage("دستور جدید با موفقیت آماده شد.");
  };

  return (
    <main className="shell space-y-6 pb-28">
      <section className="card p-5">
        <h2 className="text-3xl font-black text-[#352a2b]">دستور جدید</h2>
        <p className="mt-2 text-[#7d5f65]">
          یک دستور پخت زیبا و شخصی اضافه کن.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="card space-y-6 p-5 md:p-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#5a4446]">
            عنوان دستور
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none focus:border-[#e9aeb8]"
            placeholder="مثلاً پاستای مرغ با سس گیاهی"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#5a4446]">
            توضیح
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none focus:border-[#e9aeb8]"
            placeholder="یک توضیح کوتاه و خوش‌مزه برای دستور پخت بنویس..."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5a4446]">
              زمان آماده‌سازی
            </label>
            <input
              type="number"
              value={prepTime}
              onChange={(event) => setPrepTime(event.target.value)}
              className="w-full rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none focus:border-[#e9aeb8]"
              placeholder="15"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5a4446]">
              زمان پخت
            </label>
            <input
              type="number"
              value={cookTime}
              onChange={(event) => setCookTime(event.target.value)}
              className="w-full rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none focus:border-[#e9aeb8]"
              placeholder="25"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5a4446]">
              تعداد نفرات
            </label>
            <input
              type="number"
              min="1"
              value={servings}
              onChange={(event) => setServings(event.target.value)}
              className="w-full rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none focus:border-[#e9aeb8]"
              placeholder="2"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5a4446]">
              سطح سختی
            </label>
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              className="w-full rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none focus:border-[#e9aeb8]"
            >
              <option value="آسان">آسان</option>
              <option value="متوسط">متوسط</option>
              <option value="سخت">سخت</option>
            </select>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-black text-[#3a2828]">مواد اولیه</h3>
            <button
              type="button"
              onClick={addIngredient}
              className="btn-secondary"
            >
              + افزودن ماده
            </button>
          </div>

          <div className="space-y-3">
            {ingredients.map((item, index) => (
              <div
                key={item.id}
                className="grid gap-3 md:grid-cols-[1.3fr_0.8fr_0.7fr_auto]"
              >
                <input
                  value={item.name}
                  onChange={(event) =>
                    updateIngredient(item.id, "name", event.target.value)
                  }
                  className="rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none"
                  placeholder={`ماده ${index + 1}`}
                />
                <input
                  value={item.amount}
                  onChange={(event) =>
                    updateIngredient(item.id, "amount", event.target.value)
                  }
                  className="rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none"
                  placeholder="500"
                />
                <input
                  value={item.unit}
                  onChange={(event) =>
                    updateIngredient(item.id, "unit", event.target.value)
                  }
                  className="rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none"
                  placeholder="گرم"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(item.id)}
                  className="btn-secondary"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="mb-3 text-lg font-black text-[#3a2828]">
              مراحل پخت
            </h3>
            <button type="button" onClick={addStep} className="btn-secondary">
              + افزودن مرحله
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={`step-${index}`}
                className="flex gap-3 rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] p-3"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#fff0f3] font-bold text-[#b86271]">
                  {index + 1}
                </div>
                <textarea
                  rows={2}
                  value={step}
                  onChange={(event) => updateStep(index, event.target.value)}
                  className="w-full resize-none rounded-xl border-0 bg-transparent px-2 py-2 outline-none"
                  placeholder="توضیح مرحله پخت..."
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-semibold text-[#5a4446]">
            برچسب‌ها
          </label>
          <div className="flex flex-wrap gap-3">
            {initialTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`pill ${selectedTags.includes(tag) ? "bg-[#f7dfe4] text-[#9f5365]" : ""}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {message ? (
          <div className="rounded-2xl bg-[#fff5f6] px-3 py-2 text-sm text-[#7b5d63]">
            {message}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primary">
            ذخیره دستور
          </button>
          <button type="button" className="btn-secondary">
            پیش‌نمایش
          </button>
        </div>
      </form>
    </main>
  );
}
