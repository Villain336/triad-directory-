import { supabase } from "@/lib/supabase/client";

/**
 * Ensures a user_profiles row exists for the given user.
 * Call this after any successful authentication (login, signup, OAuth).
 * Safe to call multiple times — does upsert.
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

  await supabase.from("user_profiles").upsert(
    {
      id: user.id,
      email: user.email || null,
      full_name: fullName,
      avatar_url: avatarUrl,
      role: "business_owner",
    },
    { onConflict: "id", ignoreDuplicates: true }
  );
}
