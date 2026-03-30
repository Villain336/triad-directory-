"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="container-main py-16 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Check Your Email</h1>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          We sent a confirmation link to your email. Click it to activate your account and start managing your listing.
        </p>
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
            Claim and manage your business listing
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
