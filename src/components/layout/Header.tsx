"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu, X, Search, ChevronDown, Phone, User, LogOut,
  LayoutDashboard, MessageCircle, Shield, Building, Star,
} from "lucide-react";
import { cities, getFeaturedCities } from "@/lib/data/cities";
import { PHONE } from "@/lib/constants";
import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabase/client";
import { ensureUserProfile } from "@/lib/auth/ensure-profile";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
}

function roleLabel(role: string) {
  if (role === "admin") return "Admin";
  if (role === "business_owner") return "Business Owner";
  return "Member";
}

function roleColor(role: string) {
  if (role === "admin") return "bg-red-100 text-red-700";
  if (role === "business_owner") return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-600";
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [citiesOpen, setCitiesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const featuredCities = getFeaturedCities();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await ensureUserProfile(user);
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("full_name, avatar_url, role")
          .eq("id", user.id)
          .maybeSingle();
        setAuthUser({
          id: user.id,
          name: profile?.full_name || user.email?.split("@")[0] || "Account",
          email: user.email || "",
          avatarUrl: profile?.avatar_url || null,
          role: profile?.role || "user",
        });
      }
      setAuthChecked(true);
    }
    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("full_name, avatar_url, role")
          .eq("id", session.user.id)
          .maybeSingle();
        setAuthUser({
          id: session.user.id,
          name: profile?.full_name || session.user.email?.split("@")[0] || "Account",
          email: session.user.email || "",
          avatarUrl: profile?.avatar_url || null,
          role: profile?.role || "user",
        });
      } else {
        setAuthUser(null);
      }
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    try { await supabase.auth.signOut(); } catch {}
    setAuthUser(null);
    setUserMenuOpen(false);
    window.location.href = "/";
  }

  // Dropdown menu items based on role
  function renderDropdownItems() {
    if (!authUser) return null;
    const role = authUser.role;

    return (
      <>
        {/* Header with role badge */}
        <div className="px-3 py-2 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900 truncate">{authUser.name}</p>
          <p className="text-xs text-gray-400 truncate">{authUser.email}</p>
          <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleColor(role)}`}>
            {roleLabel(role)}
          </span>
        </div>

        {/* Admin-specific */}
        {role === "admin" && (
          <>
            <Link href="/admin" onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700">
              <Shield className="h-4 w-4" /> Admin Dashboard
            </Link>
            <Link href="/business-portal" onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700">
              <LayoutDashboard className="h-4 w-4" /> Business Portal
            </Link>
            <Link href={`/community/user/${authUser.id}`} onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700">
              <MessageCircle className="h-4 w-4" /> Community Profile
            </Link>
          </>
        )}

        {/* Business owner */}
        {role === "business_owner" && (
          <>
            <Link href="/business-portal" onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700">
              <Building className="h-4 w-4" /> My Business Portal
            </Link>
            <Link href="/pricing" onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700">
              <Star className="h-4 w-4" /> Upgrade Plan
            </Link>
            <Link href={`/community/user/${authUser.id}`} onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700">
              <MessageCircle className="h-4 w-4" /> Community Profile
            </Link>
          </>
        )}

        {/* Regular user */}
        {role === "user" && (
          <>
            <Link href={`/community/user/${authUser.id}`} onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700">
              <MessageCircle className="h-4 w-4" /> My Profile
            </Link>
            <Link href="/community" onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700">
              <User className="h-4 w-4" /> Community
            </Link>
            <Link href="/auth/upgrade" onClick={() => setUserMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50">
              <Building className="h-4 w-4" /> Switch to Business Account
            </Link>
          </>
        )}

        <hr className="my-1" />
        <button onClick={handleSignOut}
          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </>
    );
  }

  // Mobile menu items based on role
  function renderMobileAuthItems() {
    if (!authUser) return (
      <>
        <hr />
        <Link href="/auth/login" onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 py-1.5 text-sm font-medium text-primary-600">
          <User className="h-4 w-4" /> Sign In
        </Link>
        <Link href="/claim-listing" onClick={() => setMobileOpen(false)}
          className="btn-primary w-full text-center">
          Claim Your Listing
        </Link>
      </>
    );

    const role = authUser.role;
    return (
      <>
        <hr />
        <div className="py-2">
          <p className="text-xs font-semibold text-gray-900">{authUser.name}</p>
          <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleColor(role)}`}>
            {roleLabel(role)}
          </span>
        </div>
        {role === "admin" && (
          <Link href="/admin" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 py-1.5 text-sm font-medium text-gray-700">
            <Shield className="h-4 w-4 text-red-500" /> Admin Dashboard
          </Link>
        )}
        {(role === "business_owner" || role === "admin") && (
          <Link href="/business-portal" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 py-1.5 text-sm font-medium text-gray-700">
            <Building className="h-4 w-4 text-amber-500" /> Business Portal
          </Link>
        )}
        <Link href={`/community/user/${authUser.id}`} onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 py-1.5 text-sm font-medium text-gray-700">
          <MessageCircle className="h-4 w-4 text-gray-400" /> Community Profile
        </Link>
        {role === "user" && (
          <Link href="/auth/upgrade" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 py-1.5 text-sm font-medium text-amber-600">
            <Building className="h-4 w-4" /> Switch to Business Account
          </Link>
        )}
        <button onClick={() => { handleSignOut(); setMobileOpen(false); }}
          className="flex items-center gap-2 py-1.5 text-sm font-medium text-red-600">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </>
    );
  }

  return (
    <>
      {/* Top Bar — z-[60] so dropdown renders above sticky header (z-50) */}
      <div className="relative z-[60] bg-primary-800 text-white">
        <div className="container-main flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <a href={`tel:${PHONE}`} className="flex items-center gap-1 hover:text-accent-300">
              <Phone className="h-3.5 w-3.5" />
              <span>{PHONE}</span>
            </a>
            <span className="hidden sm:inline text-primary-300">|</span>
            <span className="hidden sm:inline text-primary-200">
              Serving the Triad, Triangle & Across NC
            </span>
          </div>
          <div className="flex items-center gap-3">
            {authChecked ? (
              authUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 rounded-full bg-primary-700 px-2 py-1 hover:bg-primary-600 transition-colors"
                    aria-label="User menu"
                  >
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                      authUser.role === "admin" ? "bg-red-500" : authUser.role === "business_owner" ? "bg-amber-500" : "bg-primary-500"
                    }`}>
                      {authUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-medium max-w-[100px] truncate hidden sm:inline">
                      {authUser.name}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-2xl z-[70]">
                      {renderDropdownItems()}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link>
                  <Link href="/auth/signup" className="rounded bg-amber-500 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-600 transition-colors">
                    Join Free
                  </Link>
                </>
              )
            ) : (
              <div className="h-7 w-28 rounded-full bg-primary-700 animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container-main">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>

            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <form action="/search" method="GET" className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input type="text" name="q" placeholder="Search businesses, services, or categories..."
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
              </form>
            </div>

            <nav className="hidden lg:flex items-center gap-6">
              <div className="relative"
                onMouseEnter={() => setCitiesOpen(true)}
                onMouseLeave={() => setCitiesOpen(false)}>
                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary-600">
                  Cities <ChevronDown className="h-4 w-4" />
                </button>
                {citiesOpen && (
                  <div className="absolute right-0 top-full mt-1 w-64 rounded-lg border border-gray-200 bg-white py-2 shadow-xl z-50">
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">Major Cities</div>
                    {featuredCities.map((city) => (
                      <Link key={city.slug} href={`/${city.slug}`} className="block px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700">{city.name}</Link>
                    ))}
                    <hr className="my-1" />
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">All Cities</div>
                    <div className="max-h-48 overflow-y-auto">
                      {cities.filter((c) => !c.featured).map((city) => (
                        <Link key={city.slug} href={`/${city.slug}`} className="block px-3 py-1.5 text-sm text-gray-600 hover:bg-primary-50 hover:text-primary-700">{city.name}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link href="/categories" className="text-sm font-medium text-gray-700 hover:text-primary-600">Categories</Link>
              <Link href="/community" className="text-sm font-medium text-gray-700 hover:text-primary-600">Community</Link>
              <Link href="/deals" className="text-sm font-medium text-gray-700 hover:text-primary-600">Deals</Link>
              <Link href="/request-service" className="btn-primary text-sm !py-2 !px-4">Request Service</Link>
            </nav>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-600" aria-label="Toggle menu">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className="md:hidden pb-3">
            <form action="/search" method="GET" className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="text" name="q" placeholder="Search businesses..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </form>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="container-main py-4 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">Major Cities</div>
              {featuredCities.map((city) => (
                <Link key={city.slug} href={`/${city.slug}`} onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm text-gray-700">{city.name}</Link>
              ))}
              <hr />
              <Link href="/categories" onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm font-medium text-gray-700">All Categories</Link>
              <Link href="/community" onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm font-medium text-gray-700">Community</Link>
              <Link href="/deals" onClick={() => setMobileOpen(false)} className="block py-1.5 text-sm font-medium text-gray-700">Deals</Link>
              {authChecked && renderMobileAuthItems()}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
