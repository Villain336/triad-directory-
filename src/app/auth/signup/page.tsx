"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, Building, Search } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { ensureUserProfile } from "@/lib/auth/ensure-profile";

function SignupForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [accountType, setAccountType] = useState<"user" | "business_owner">("user");

  const redirectForRole = accountType === "business_owner" ? "/business-portal" : redirectTo;

  async function handleGoogleSignIn() {
    setOauthLoading(true);
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?redirect=${encodeURIComponent(redirectForRole)}&role=${accountType}`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setOauthLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: accountType },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?redirect=${encodeURIComponent(redirectForRole)}&role=${accountType}`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Auto-confirmed (no email verification) — redirect immediately
    if (data.session && data.user) {
      await ensureUserProfile({ ...data.user, role: accountType } as any);
      if (redirectTo === "/") {
        // No explicit redirect — do smart redirect by role
        const res = await fetch("/api/auth/redirect");
        const { url } = await res.json();
        window.location.href = url;
      } else {
        window.location.href = redirectForRole;
      }
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="container-main py-16 text-center">
        <div className="mx-auto max-w-md">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Check Your Email</h1>
          <p className="mt-2 text-gray-600">
            We sent a confirmation link to your email. Click it to activate your account.
          </p>
          <div className="mt-6 rounded-xl bg-primary-50 border border-primary-200 p-4 text-left">
            <h3 className="font-semibold text-primary-900 text-sm">What happens next?</h3>
            <ol className="mt-2 space-y-2 text-sm text-primary-800">
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">1</span>
                Click the confirmation link in your email
              </li>
              <li className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">2</span>
                {accountType === "business_owner"
                  ? "You'll be taken to your Business Portal to claim your listing"
                  : "You'll be redirected back to start exploring"}
              </li>
            </ol>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Didn&apos;t receive it? Check your spam folder or{" "}
            <button onClick={() => setSuccess(false)} className="text-primary-600 hover:underline font-medium">
              try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <UserPlus className="mx-auto h-10 w-10 text-primary-600" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-1 text-sm text-gray-600">
            Join NC Service Businesses
          </p>
        </div>

        {/* Account Type Selector */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAccountType("user")}
            className={`rounded-xl border-2 p-4 text-center transition-all ${
              accountType === "user"
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Search className={`mx-auto h-6 w-6 ${accountType === "user" ? "text-primary-600" : "text-gray-400"}`} />
            <p className={`mt-2 text-sm font-semibold ${accountType === "user" ? "text-primary-900" : "text-gray-700"}`}>
              Looking for services
            </p>
            <p className="mt-0.5 text-xs text-gray-500">Browse, review, ask questions</p>
          </button>
          <button
            type="button"
            onClick={() => setAccountType("business_owner")}
            className={`rounded-xl border-2 p-4 text-center transition-all ${
              accountType === "business_owner"
                ? "border-primary-500 bg-primary-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Building className={`mx-auto h-6 w-6 ${accountType === "business_owner" ? "text-primary-600" : "text-gray-400"}`} />
            <p className={`mt-2 text-sm font-semibold ${accountType === "business_owner" ? "text-primary-900" : "text-gray-700"}`}>
              I own a business
            </p>
            <p className="mt-0.5 text-xs text-gray-500">Claim listing, get leads</p>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={oauthLoading}
          className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" />
            <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332Z" />
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58Z" />
          </svg>
          {oauthLoading ? "Redirecting..." : "Continue with Google"}
        </button>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-gray-400">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="text" id="fullName" name="fullName" required autoComplete="name"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="email" id="email" name="email" required autoComplete="email"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="password" id="password" name="password" required minLength={8} autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
            <p className="mt-1 text-xs text-gray-400">Minimum 8 characters</p>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : accountType === "business_owner" ? "Create Business Account" : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href={`/auth/login${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="text-primary-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
