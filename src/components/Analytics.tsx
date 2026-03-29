"use client";

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Track custom events from components
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", eventName, params);
  }
}

// Pre-built event helpers
export function trackLeadSubmission(source: string, city?: string, category?: string) {
  trackEvent("generate_lead", {
    event_category: "lead",
    event_label: source,
    city: city || "",
    category: category || "",
  });
}

export function trackPhoneClick(businessName: string, city: string) {
  trackEvent("phone_click", {
    event_category: "engagement",
    event_label: businessName,
    city,
  });
}

export function trackFormView(formName: string) {
  trackEvent("form_view", {
    event_category: "engagement",
    event_label: formName,
  });
}

export function trackListingView(businessName: string, tier: string, city: string) {
  trackEvent("listing_view", {
    event_category: "engagement",
    event_label: businessName,
    tier,
    city,
  });
}
