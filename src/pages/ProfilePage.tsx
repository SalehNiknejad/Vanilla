import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{
    id: string;
    displayName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  } | null>(null);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    publicRecipes: 0,
    favorites: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const loadProfile = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) {
      setProfile(null);
      return;
    }

    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("id, display_name, phone_number, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    const displayName =
      (profileData?.display_name as string | undefined) ??
      (user.user_metadata?.display_name as string | undefined) ??
      (user.email ? user.email.split("@")[0] : "کاربر");

    const phoneNumber =
      (profileData?.phone_number as string | undefined) ??
      (user.user_metadata?.phone as string | undefined);

    setProfile({
      id: user.id,
      displayName,
      email: user.email ?? "",
      phone: phoneNumber,
      avatarUrl:
        (profileData?.avatar_url as string | undefined) ??
        (user.user_metadata?.avatar_url as string | undefined),
    });

    if (error && error.code !== "PGRST116") {
      console.error("Profile load failed:", error);
    }

    const [totalRecipesResult, publicRecipesResult, favoritesResult] =
      await Promise.all([
        supabase
          .from("recipes")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("recipes")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("is_public", true),
        supabase
          .from("favorites")
          .select("recipe_id", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

    setStats({
      totalRecipes: totalRecipesResult.count ?? 0,
      publicRecipes: publicRecipesResult.count ?? 0,
      favorites: favoritesResult.count ?? 0,
    });
  };

  useEffect(() => {
    let mounted = true;

    const syncProfile = async () => {
      if (!mounted) return;
      await loadProfile();
    };

    void syncProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event) => {
      if (!mounted) return;
      void loadProfile();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    setUploading(true);
    setMessage("");

    try {
      const filePath = `${profile.id}/avatar-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setProfile((current) =>
        current ? { ...current, avatarUrl: publicUrl } : current,
      );
      setMessage("عکس پروفایل با موفقیت آپلود شد.");
    } catch (error) {
      console.error("Avatar upload failed:", error);
      setMessage(
        "آپلود عکس انجام نشد. مطمئن شوید bucket avatars در Supabase وجود دارد.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate("/auth", { replace: true });
      return;
    }

    setMessage("خروج انجام نشد. دوباره تلاش کنید.");
  };

  if (!profile) {
    return <main className="shell pb-28">در حال بارگذاری پروفایل...</main>;
  }

  return (
    <main className="shell space-y-6 pb-28">
      <section className="card p-5 md:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <label className="group relative block cursor-pointer">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-[#f7dfe5]"
                />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#f7dfe5] to-[#f5d3b0] text-3xl ring-4 ring-[#f7dfe5]">
                  👩‍🍳
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
              <span className="absolute inset-0 grid place-items-center rounded-full bg-black/20 text-[10px] text-white opacity-0 transition group-hover:opacity-100">
                {uploading ? "..." : "آپلود"}
              </span>
            </label>
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

          <div className="flex flex-wrap gap-3">
            <button className="btn-primary">ویرایش پروفایل</button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-secondary"
            >
              خروج از حساب
            </button>
          </div>
        </div>

        {message ? (
          <div className="mt-4 rounded-2xl bg-[#fff5f6] px-3 py-2 text-sm text-[#7b5d63]">
            {message}
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [String(stats.totalRecipes), "دستور پخت"],
          [String(stats.publicRecipes), "دستورهای عمومی"],
          [String(stats.favorites), "علاقه‌مندی‌ها"],
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
