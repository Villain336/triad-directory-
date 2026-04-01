import { NextRequest, NextResponse } from "next/server";
import { createAuthClient } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirect") || "/business-portal";

  if (code) {
    const supabase = createAuthClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // Auto-create user_profiles row if it doesn't exist
    if (data?.user) {
      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!existingProfile) {
        const fullName =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "";

        await supabase.from("user_profiles").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          role: "business_owner",
        });
      }
    }
  }

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
