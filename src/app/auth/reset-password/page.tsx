"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
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
            We sent a password reset link to your email. Click it to set a new password.
          </p>
          <Link href="/auth/login" className="mt-6 inline-flex items-center gap-2 text-sm text-primary-600 hover:underline font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-16">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <Mail className="mx-auto h-10 w-10 text-primary-600" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-1 text-sm text-gray-600">
            Enter your email and we&apos;ll send you a reset link
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="email" id="email" name="email" required autoComplete="email"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link href="/auth/login" className="inline-flex items-center gap-1 text-primary-600 hover:underline font-medium">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
