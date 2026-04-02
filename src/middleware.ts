import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // Create a response that we can modify
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const pathname = request.nextUrl.pathname;

  // Routes that require authentication
  const authRequired = ["/business-portal", "/admin", "/account"];
  const needsAuth = authRequired.some((path) => pathname === path || pathname.startsWith(path + "/"));

  if (!needsAuth) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
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
    .maybeSingle();

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
      return NextResponse.redirect(new URL("/auth/upgrade", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/business-portal", "/business-portal/:path*", "/account", "/account/:path*"],
};
