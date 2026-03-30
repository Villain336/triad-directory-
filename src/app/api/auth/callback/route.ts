import { NextRequest, NextResponse } from "next/server";
import { createAuthClient } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createAuthClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL("/business-portal", request.url));
}
