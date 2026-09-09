import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ?? "https://demo.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? "demo-anon-key";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : ({
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          signInWithPassword: async () => ({ data: null, error: null }),
          signUp: async () => ({ data: null, error: null }),
          signOut: async () => ({ error: null }),
        },
        storage: {
          from: () => ({
            upload: async () => ({ data: null, error: null }),
            getPublicUrl: () => ({ data: { publicUrl: "" } }),
          }),
        },
      } as unknown as ReturnType<typeof createClient>);

export { supabaseUrl, supabaseAnonKey };
