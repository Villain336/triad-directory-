import { NextRequest, NextResponse } from "next/server";
import { createAuthClient } from "@/lib/auth/session";

export async function GET(_request: NextRequest) {
  const supabase = createAuthClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ url: "/auth/login" });
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role || "user";

  let url = "/account";
  if (role === "admin") url = "/admin";
  else if (role === "business_owner") url = "/business-portal";

  return NextResponse.json({ url });
}
