import { Link } from "react-router-dom";

export default function AuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-6 md:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#f9dfe5] to-[#efadbb] text-3xl shadow-soft">
            🍦
          </div>
          <h1 className="text-3xl font-black text-[#3a2a2d]">Vanilla</h1>
          <p className="mt-2 text-[#7b5d63]">همین حالا وارد حسابت شو</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5a4446]">
              ایمیل
            </label>
            <input
              type="email"
              className="w-full rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none focus:border-[#e9aeb8]"
              placeholder="hello@vanilla.app"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5a4446]">
              رمز عبور
            </label>
            <input
              type="password"
              className="w-full rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none focus:border-[#e9aeb8]"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            ورود
          </button>
          <Link to="/" className="btn-secondary w-full">
            بازگشت به خانه
          </Link>
        </form>
      </div>
    </main>
  );
}
