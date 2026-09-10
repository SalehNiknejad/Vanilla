import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildPhoneAuthEmail, supabase } from "../lib/supabase";

const persianToEnglishDigits: Record<string, string> = {
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
};

const toPersianDigits = (value: string) =>
  value.replace(/\d/g, (digit) => {
    const persianDigit = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"][
      Number(digit)
    ];
    return persianDigit ?? digit;
  });

const getFriendlyAuthMessage = (error: unknown) => {
  if (!(error instanceof Error)) {
    return "اطلاعات وارد شده معتبر نیست. لطفاً دوباره تلاش کنید.";
  }

  const message = error.message.toLowerCase();

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid_credentials") ||
    message.includes("wrong password") ||
    message.includes("user not found")
  ) {
    return "شماره موبایل یا رمز عبور اشتباه است.";
  }

  if (
    message.includes("already registered") ||
    message.includes("user already registered") ||
    message.includes("email exists") ||
    message.includes("duplicate")
  ) {
    return "این حساب قبلاً ثبت شده است. لطفاً وارد شوید.";
  }

  if (message.includes("password") && message.includes("least")) {
    return "رمز عبور باید حداقل ۶ کاراکتر داشته باشد.";
  }

  if (message.includes("email") && message.includes("invalid")) {
    return "شماره موبایل وارد شده معتبر نیست.";
  }

  return "اطلاعات وارد شده معتبر نیست. لطفاً دوباره تلاش کنید.";
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/", { replace: true });
      }
    });
  }, [navigate]);

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const cleanedValue = rawValue
      .replace(/[^\d۰-۹]/g, "")
      .split("")
      .map((char) => persianToEnglishDigits[char] ?? char)
      .join("");

    setPhone(cleanedValue);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedPhone = phone.trim();
    const authEmail = buildPhoneAuthEmail(normalizedPhone);

    if (mode === "signup" && !fullName.trim()) {
      setMessage("لطفاً نام کامل خود را وارد کنید.");
      return;
    }

    if (!normalizedPhone || !password || !authEmail) {
      setMessage("شماره موبایل و رمز عبور را وارد کنید.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: authEmail,
          password,
          options: {
            data: {
              phone: normalizedPhone,
              display_name: fullName.trim(),
            },
          },
        });

        if (error) throw error;

        if (data.session) {
          navigate("/", { replace: true });
          return;
        }

        const loginResult = await supabase.auth.signInWithPassword({
          email: authEmail,
          password,
        });

        if (loginResult.error) throw loginResult.error;

        setMessage("حساب ساخته شد و وارد شدید.");
        navigate("/", { replace: true });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password,
        });

        if (error) throw error;

        if (data.session) {
          navigate("/", { replace: true });
          return;
        }

        setMessage("ورود با موفقیت انجام شد.");
      }
    } catch (error) {
      setMessage(getFriendlyAuthMessage(error));
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

        <div className="mb-4 flex justify-center rounded-full bg-[#fff4f6] p-1">
          <div className="flex w-full max-w-[280px] rounded-full bg-[#fff4f6] p-1">
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
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" ? (
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#5a4446]">
                نام کامل
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 outline-none focus:border-[#e9aeb8]"
                placeholder="نام و نام خانوادگی"
              />
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#5a4446]">
              شماره موبایل
            </label>
            <input
              type="tel"
              inputMode="numeric"
              lang="fa"
              dir="rtl"
              value={toPersianDigits(phone)}
              onChange={handlePhoneChange}
              className="w-full rounded-2xl border border-[#f0dfe3] bg-[#fffdfd] px-4 py-3 text-right outline-none focus:border-[#e9aeb8]"
              placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
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

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full max-w-[220px] text-center disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "در حال انجام..."
                : mode === "login"
                  ? "ورود"
                  : "ثبت‌نام"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
