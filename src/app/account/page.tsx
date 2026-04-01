"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User, Mail, Phone, Shield, Building, MessageCircle, Calendar,
  Save, LogOut, Trash2, AlertCircle, CheckCircle, ExternalLink,
  Edit2, ArrowUpRight, HelpCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

interface ActivityStats {
  questionCount: number;
}

function roleLabel(role: string) {
  if (role === "admin") return "Admin";
  if (role === "business_owner") return "Business Owner";
  return "Member";
}

function roleDescription(role: string) {
  if (role === "admin") return "Full access to all platform features and management tools.";
  if (role === "business_owner") return "Manage your business listing, respond to inquiries, and track leads.";
  return "Browse businesses, ask questions, leave reviews, and get service quotes.";
}

function roleColor(role: string) {
  if (role === "admin") return "bg-red-100 text-red-700";
  if (role === "business_owner") return "bg-amber-100 text-amber-700";
  return "bg-blue-100 text-blue-700";
}

function avatarColor(role: string) {
  if (role === "admin") return "bg-red-500";
  if (role === "business_owner") return "bg-amber-500";
  return "bg-primary-500";
}

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [activity, setActivity] = useState<ActivityStats>({ questionCount: 0 });
  const [deleteMessage, setDeleteMessage] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/auth/login?redirect=/account";
        return;
      }

      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("id, email, full_name, role, avatar_url, phone, created_at")
        .eq("id", user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as UserProfile);
        setFullName(profileData.full_name || "");
        setPhone(profileData.phone || "");
      }

      // Fetch activity stats
      const { count: qCount } = await supabase
        .from("community_questions")
        .select("id", { count: "exact", head: true })
        .eq("author_id", user.id);

      setActivity({ questionCount: qCount || 0 });
      setLoading(false);
    }

    loadData();
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSaveStatus("idle");
    setSaveError("");

    const { error } = await supabase
      .from("user_profiles")
      .update({ full_name: fullName, phone: phone || null, updated_at: new Date().toISOString() })
      .eq("id", profile.id);

    if (error) {
      setSaveStatus("error");
      setSaveError(error.message);
    } else {
      setSaveStatus("success");
      setProfile((prev) => prev ? { ...prev, full_name: fullName, phone: phone || null } : prev);
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
    setSaving(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="container-main py-16">
        <div className="mx-auto max-w-2xl space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const memberSince = new Date(profile.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const displayName = profile.full_name || profile.email.split("@")[0] || "Account";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="container-main py-10">
      <div className="mx-auto max-w-2xl space-y-6">

        {/* Header section */}
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className={`h-16 w-16 shrink-0 rounded-full flex items-center justify-center text-2xl font-bold text-white ${avatarColor(profile.role)}`}>
              {avatarLetter}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">{displayName}</h1>
              <p className="text-sm text-gray-500 truncate">{profile.email}</p>
              <span className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleColor(profile.role)}`}>
                {roleLabel(profile.role)}
              </span>
            </div>
            <Link
              href="#profile-settings"
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Profile Settings card */}
        <div id="profile-settings" className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-primary-600" />
            Profile Settings
          </h2>

          {saveStatus === "success" && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 flex items-center gap-2 text-sm text-green-700">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Profile updated successfully.
            </div>
          )}
          {saveStatus === "error" && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {saveError || "Failed to save changes."}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Account Info card */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary-600" />
            Account Information
          </h2>
          <dl className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <dt className="text-xs text-gray-500">Email</dt>
                  <dd className="text-sm font-medium text-gray-900 truncate">{profile.email}</dd>
                </div>
              </div>
              <span className="text-xs text-gray-400 shrink-0 mt-3">Read-only</span>
            </div>

            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <dt className="text-xs text-gray-500">Role</dt>
                <dd className="flex items-center gap-2 mt-0.5">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${roleColor(profile.role)}`}>
                    {roleLabel(profile.role)}
                  </span>
                </dd>
                <p className="text-xs text-gray-400 mt-1">{roleDescription(profile.role)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <div>
                <dt className="text-xs text-gray-500">Member since</dt>
                <dd className="text-sm font-medium text-gray-900">{memberSince}</dd>
              </div>
            </div>
          </dl>

          {/* Role-specific action link */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            {profile.role === "user" && (
              <Link
                href="/auth/upgrade"
                className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700"
              >
                <Building className="h-4 w-4" />
                Switch to Business Account
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
            {profile.role === "business_owner" && (
              <Link
                href="/business-portal"
                className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                <Building className="h-4 w-4" />
                Go to Business Portal
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
            {profile.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
              >
                <Shield className="h-4 w-4" />
                Admin Dashboard
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* My Activity card */}
        <div className="card p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary-600" />
            My Activity
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <HelpCircle className="h-5 w-5 text-primary-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{activity.questionCount}</p>
              <p className="text-xs text-gray-500 mt-0.5">Questions Asked</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 text-center">
              <MessageCircle className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">—</p>
              <p className="text-xs text-gray-500 mt-0.5">Answers Given</p>
            </div>
          </div>
          <Link
            href={`/community/user/${profile.id}`}
            className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ExternalLink className="h-4 w-4" />
            View full community profile
          </Link>
        </div>

        {/* Danger Zone */}
        <div className="card p-6 border-red-100">
          <h2 className="text-base font-semibold text-red-700 mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Account Actions
          </h2>
          <div className="space-y-3">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>

            <div>
              <button
                onClick={() => setDeleteMessage(true)}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4" />
                Delete Account
              </button>
              {deleteMessage && (
                <p className="mt-2 text-sm text-gray-500 rounded-lg bg-gray-50 border border-gray-200 p-3">
                  To delete your account, please contact our support team at{" "}
                  <a href="mailto:support@ncservicebusinesses.com" className="text-primary-600 hover:underline">
                    support@ncservicebusinesses.com
                  </a>
                  . We will process your request within 5 business days.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
