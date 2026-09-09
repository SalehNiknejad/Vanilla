import { useState } from "react";

export default function CreateRecipePage() {
  const [steps, setSteps] = useState<string[]>([
    "پیاز را خرد کنید و تفت دهید.",
    "مرغ را اضافه کرده و هم بزنید.",
    "ادویه‌ها را اضافه کنید و سرو کنید.",
  ]);

  return (
    <main className="shell space-y-6 pb-28">
      <section className="card p-5">
        <h2 className="text-3xl font-black text-[#352a2b]">دستور جدید</h2>
        <p className="mt-2 text-[#7d5f65]">
          یک دستور پخت زیبا و شخصی اضافه کن.
        </p>
      </section>

      <section className="card p-5 md:p-6">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5a4446]">
              عنوان دستور
            </label>
            <input
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
                className="w-full rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none focus:border-[#e9aeb8]"
                placeholder="2"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#5a4446]">
                سطح سختی
              </label>
              <select className="w-full rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none focus:border-[#e9aeb8]">
                <option>آسان</option>
                <option>متوسط</option>
                <option>سخت</option>
              </select>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-black text-[#3a2828]">
              مواد اولیه
            </h3>
            <div className="space-y-3">
              {["مرغ", "پیاز", "گوجه", "پنیر"].map((item, index) => (
                <div
                  key={item}
                  className="grid gap-3 md:grid-cols-[1.3fr_0.8fr_0.7fr_auto]"
                >
                  <input
                    defaultValue={item}
                    className="rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none"
                  />
                  <input
                    defaultValue={index === 0 ? "500" : "2"}
                    className="rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none"
                  />
                  <input
                    defaultValue={index === 0 ? "گرم" : "عدد"}
                    className="rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none"
                  />
                  <button className="btn-secondary">حذف</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-black text-[#3a2828]">
              مراحل پخت
            </h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] p-3"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-[#fff0f3] font-bold text-[#b86271]">
                    {index + 1}
                  </div>
                  <textarea
                    rows={2}
                    value={step}
                    className="w-full resize-none rounded-xl border-0 bg-transparent px-2 py-2 outline-none"
                  />
                </div>
              ))}
            </div>
            <button className="btn-secondary mt-4">+ افزودن مرحله</button>
          </div>

          <div className="flex flex-wrap gap-3">
            {["صبحانه", "شام", "غذای برنجی", "سریع"].map((tag) => (
              <button key={tag} className="pill">
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
