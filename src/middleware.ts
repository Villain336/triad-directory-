import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // Routes that require authentication
  const authRequired = ["/business-portal", "/admin"];
  const needsAuth = authRequired.some((path) => pathname === path || pathname.startsWith(path + "/"));

  if (!needsAuth) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in → redirect to login with return URL
  if (!user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Fetch role for protected routes
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "user";

  // Admin routes — admin only
  if (pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Business portal — business_owner or admin
  if (pathname.startsWith("/business-portal")) {
    if (role !== "business_owner" && role !== "admin") {
      // Casual user trying to access portal → upgrade prompt
      return NextResponse.redirect(new URL("/auth/upgrade", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/business-portal", "/business-portal/:path*"],
};
