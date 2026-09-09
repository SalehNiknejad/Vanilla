import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { label: "خانه", to: "/" },
  { label: "دستور پخت", to: "/recipes" },
  { label: "مواد", to: "/ingredients" },
  { label: "علاقه‌مندی‌ها", to: "/favorites" },
  { label: "پروفایل", to: "/profile" },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-transparent text-[#3b2d2d]">
      <header className="sticky top-0 z-40 border-b border-[#f2e6e8] bg-[#fffafc]/80 backdrop-blur-xl">
        <div className="shell flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#f9dfe5] to-[#f3b5c0] text-xl shadow-soft">
              🍦
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#a06d7a]">
                Vanilla
              </p>
              <h1 className="text-lg font-extrabold text-[#432f32]">
                خانه‌ی شیرین
              </h1>
            </div>
          </div>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#fff0f3] text-[#ab5a6b] shadow-sm"
                      : "text-[#584849] hover:bg-[#fff7f8]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="btn-secondary hidden md:inline-flex">
              جستجو
            </button>
            <NavLink to="/create" className="btn-primary">
              + دستور جدید
            </NavLink>
          </div>
        </div>
      </header>

      <Outlet />

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#f2e6e8] bg-white/90 p-3 backdrop-blur-xl md:hidden">
        <div className="grid grid-cols-5 gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium ${
                  isActive ? "bg-[#fff0f3] text-[#b6596d]" : "text-[#67585a]"
                }`
              }
            >
              <span className="text-lg">
                {item.to === "/"
                  ? "🏠"
                  : item.to === "/recipes"
                    ? "🍽️"
                    : item.to === "/ingredients"
                      ? "🥕"
                      : item.to === "/favorites"
                        ? "💗"
                        : "👤"}
              </span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
