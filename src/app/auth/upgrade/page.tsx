"use client";

import Link from "next/link";
import { Building, ArrowRight, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

export default function UpgradeAccountPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleUpgrade() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/auth/login?redirect=/business-portal";
      return;
    }

    const { error } = await supabase
      .from("user_profiles")
      .update({ role: "business_owner" })
      .eq("id", user.id);

    if (!error) {
      setDone(true);
      setTimeout(() => {
        window.location.href = "/business-portal";
      }, 1000);
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="container-main py-20 text-center">
        <Shield className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Account Upgraded!</h1>
        <p className="mt-2 text-gray-600">Redirecting to your Business Portal...</p>
      </div>
    );
  }

  return (
    <div className="container-main py-16">
      <div className="mx-auto max-w-md text-center">
        <Building className="mx-auto h-12 w-12 text-primary-600" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Switch to a Business Account
        </h1>
        <p className="mt-2 text-gray-600">
          The Business Portal is for business owners who want to manage their
          listing, track leads, and respond to customers.
        </p>

        <div className="mt-8 space-y-3">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="btn-primary w-full gap-2"
          >
            <Building className="h-4 w-4" />
            {loading ? "Upgrading..." : "Yes, I Own a Business"}
          </button>
          <Link href="/" className="btn-secondary w-full text-center block">
            No, Take Me Home
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          You can always switch back from your profile settings.
        </p>
      </div>
    </div>
  );
}
