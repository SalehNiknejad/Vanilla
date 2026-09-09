import { useState } from "react";
import { Link } from "react-router-dom";
import { buildPhoneAuthEmail, supabase } from "../lib/supabase";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedPhone = phone.trim();
    const authEmail = buildPhoneAuthEmail(normalizedPhone);

    if (!normalizedPhone || !password || !authEmail) {
      setMessage("شماره موبایل و رمز عبور را وارد کنید.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password,
          options: {
            data: {
              phone: normalizedPhone,
              display_name: normalizedPhone,
            },
          },
        });

        if (error) throw error;
        setMessage("حساب ساخته شد. حالا می‌توانید وارد شوید.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password,
        });

        if (error) throw error;
        setMessage("ورود با موفقیت انجام شد.");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "مشکلی در ورود رخ داد. لطفاً دوباره تلاش کنید.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-6 md:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#f9dfe5] to-[#efadbb] text-3xl shadow-soft">
            🍦
          </div>
          <h1 className="text-3xl font-black text-[#3a2a2d]">Vanilla</h1>
          <p className="mt-2 text-[#7b5d63]">
            {mode === "login"
              ? "ورود با موبایل و رمز عبور"
              : "ثبت‌نام با موبایل و رمز عبور"}
          </p>
        </div>

        <div className="mb-4 flex rounded-full bg-[#fff4f6] p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
              mode === "login"
                ? "bg-white text-[#b55d70] shadow-sm"
                : "text-[#765a60]"
            }`}
          >
            ورود
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
              mode === "signup"
                ? "bg-white text-[#b55d70] shadow-sm"
                : "text-[#765a60]"
            }`}
          >
            ثبت‌نام
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5a4446]">
              شماره موبایل
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none focus:border-[#e9aeb8]"
              placeholder="0912 345 6789"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5a4446]">
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none focus:border-[#e9aeb8]"
              placeholder="حداقل ۶ کاراکتر"
            />
          </div>

          {message ? (
            <div className="rounded-2xl bg-[#fff5f6] px-3 py-2 text-sm text-[#7b5d63]">
              {message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? "در حال انجام..."
              : mode === "login"
                ? "ورود"
                : "ثبت‌نام"}
          </button>

          <Link to="/" className="btn-secondary w-full">
            بازگشت به خانه
          </Link>
        </form>
      </div>
    </main>
  );
}
