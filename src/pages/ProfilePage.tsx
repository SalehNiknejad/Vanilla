import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProfilePage() {
  const [profile, setProfile] = useState<{
    displayName: string;
    email: string;
    phone?: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;

    const syncProfile = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const user = data.session?.user;
      if (!user) {
        setProfile(null);
        return;
      }

      const rawPhone = user.user_metadata?.phone as string | undefined;
      const displayName =
        (user.user_metadata?.display_name as string | undefined) ??
        (user.email ? user.email.split("@")[0] : "کاربر");

      setProfile({
        displayName,
        email: user.email ?? "",
        phone: rawPhone,
      });
    };

    void syncProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const user = session?.user;
      if (!user) {
        setProfile(null);
        return;
      }

      setProfile({
        displayName:
          (user.user_metadata?.display_name as string | undefined) ??
          (user.email ? user.email.split("@")[0] : "کاربر"),
        email: user.email ?? "",
        phone: user.user_metadata?.phone as string | undefined,
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!profile) {
    return <main className="shell pb-28">در حال بارگذاری پروفایل...</main>;
  }

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
                {profile.displayName}
              </h2>
              <p className="text-[#7c5f64]">{profile.email}</p>
              {profile.phone ? (
                <p className="mt-1 text-sm text-[#7c5f64]">{profile.phone}</p>
              ) : null}
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
