"use client";

import Script from "next/script";

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function RecaptchaScript() {
  if (!RECAPTCHA_SITE_KEY) return null;

  return (
    <Script
      src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
      strategy="afterInteractive"
    />
  );
}

export async function getRecaptchaToken(action: string): Promise<string | null> {
  if (!RECAPTCHA_SITE_KEY) return null;

  try {
    const grecaptcha = (window as any).grecaptcha;
    if (!grecaptcha) return null;

    return await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
  } catch {
    return null;
  }
}

export async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) return true; // Skip if not configured

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });
    const data = await res.json();
    return data.success && data.score >= 0.5;
  } catch {
    return false;
  }
}
