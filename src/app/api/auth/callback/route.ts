import { NextRequest, NextResponse } from "next/server";
import { createAuthClient } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect") || "/";
  const role = requestUrl.searchParams.get("role") || "user";

  if (code) {
    const supabase = createAuthClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // Create or update user_profiles row
    if (data?.user) {
      const fullName =
        data.user.user_metadata?.full_name ||
        data.user.user_metadata?.name ||
        data.user.email?.split("@")[0] ||
        "";

      const { data: existing } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("user_profiles").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          avatar_url: data.user.user_metadata?.avatar_url || null,
          role: role === "business_owner" ? "business_owner" : "user",
        });
      }
    }
  }

  // Redirect business owners to portal, everyone else to their requested page
  const finalRedirect = role === "business_owner" && redirectTo === "/"
    ? "/business-portal"
    : redirectTo;

  return NextResponse.redirect(new URL(finalRedirect, request.url));
}
