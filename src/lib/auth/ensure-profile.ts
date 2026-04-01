import { supabase } from "@/lib/supabase/client";

/**
 * Ensures a user_profiles row exists for the given user.
 * Uses insert with ON CONFLICT DO NOTHING to avoid RLS issues with upsert.
 */
export async function ensureUserProfile(user: {
  id: string;
  email?: string;
  user_metadata?: { full_name?: string; name?: string; avatar_url?: string };
}) {
  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "";

  const avatarUrl = user.user_metadata?.avatar_url || null;

  // Try insert first (most common case - profile doesn't exist yet)
  const { error } = await supabase.from("user_profiles").insert({
    id: user.id,
    email: user.email || null,
    full_name: fullName,
    avatar_url: avatarUrl,
    role: "business_owner",
  });

  // 23505 = unique_violation = profile already exists, which is fine
  if (error && error.code !== "23505") {
    console.error("ensureUserProfile error:", error);
  }
}
