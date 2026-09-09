export default function ProfilePage() {
  return (
    <main className="shell space-y-6 pb-28">
      <section className="card p-5 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#f7dfe5] to-[#f5d3b0] text-3xl">
              👩‍🍳
            </div>
            <div>
              <h2 className="text-3xl font-black text-[#352a2b]">
                آوا خان آبادی قهی
              </h2>
              <p className="text-[#7c5f64]">Ava@vanilla.app</p>
            </div>
          </div>
          <button className="btn-primary">ویرایش پروفایل</button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["12", "دستور پخت"],
          ["5", "دستورهای عمومی"],
          ["9", "علاقه‌مندی‌ها"],
        ].map(([value, label]) => (
          <div key={label} className="card p-5 text-center">
            <p className="text-3xl font-black text-[#3d2f32]">{value}</p>
            <p className="mt-2 text-sm text-[#7d5f65]">{label}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
