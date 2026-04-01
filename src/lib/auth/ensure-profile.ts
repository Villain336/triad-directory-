import { supabase } from "@/lib/supabase/client";

/**
 * Ensures a user_profiles row exists for the given user.
 * Uses insert with conflict handling — safe to call multiple times.
 */
export async function ensureUserProfile(user: {
  id: string;
  email?: string;
  role?: string;
  user_metadata?: { full_name?: string; name?: string; avatar_url?: string; role?: string };
}) {
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "";

  const avatarUrl = user.user_metadata?.avatar_url || null;
  const role = user.role || user.user_metadata?.role || "user";

  const { error } = await supabase.from("user_profiles").insert({
    id: user.id,
    email: user.email || null,
    full_name: fullName,
    avatar_url: avatarUrl,
    role,
  });

  // 23505 = unique_violation = profile already exists, which is fine
  if (error && error.code !== "23505") {
    console.error("ensureUserProfile error:", error);
  }
}
