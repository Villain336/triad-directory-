import { createServerClient as createSSRClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createAuthClient() {
  const cookieStore = cookies();

  return createSSRClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // This can happen in Server Components
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // This can happen in Server Components
          }
        },
      },
    }
  );
}

export async function getSession() {
  const supabase = createAuthClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const supabase = createAuthClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile() {
  const user = await getUser();
  if (!user) return null;

  const supabase = createAuthClient();
  const { data } = await supabase
    .from("user_profiles")
    .select("*, organizations(*)")
    .eq("id", user.id)
    .single();

  return data;
}

export async function isAdmin() {
  const profile = await getUserProfile();
  return profile?.role === "admin";
}
