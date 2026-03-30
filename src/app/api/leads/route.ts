import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { sendLeadNotification } from "@/lib/email/send";
import { SITE_URL } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, listingId, citySlug, categorySlug, source, recaptchaToken } = body;

    if (!email && !phone) {
      return NextResponse.json({ error: "Email or phone is required" }, { status: 400 });
    }

    // Verify reCAPTCHA if configured
    if (process.env.RECAPTCHA_SECRET_KEY && recaptchaToken) {
      const { verifyRecaptcha } = await import("@/components/RecaptchaWrapper");
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return NextResponse.json({ error: "Spam detected" }, { status: 403 });
      }
    }

    const supabase = createServerClient();

    const { error } = await supabase.from("leads").insert({
      name,
      email,
      phone,
      message,
      business_id: listingId || null,
      city_slug: citySlug,
      category_slug: categorySlug,
      source: source || "contact_form",
      source_page: request.headers.get("referer"),
    });

    if (error) {
      console.error("Lead insert error:", error);
      return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
    }

    // Send email notification to business owner if listing has an email
    if (listingId) {
      const { data: business } = await supabase
        .from("businesses")
        .select("name, email, slug, cities!inner(slug), categories!inner(slug)")
        .eq("id", listingId)
        .single();

      if (business?.email) {
        const listingUrl = `${SITE_URL}/${(business as any).cities?.slug}/${(business as any).categories?.slug}/${business.slug}`;
        await sendLeadNotification({
          to: business.email,
          businessName: business.name,
          leadName: name || "Someone",
          leadEmail: email || "",
          leadPhone: phone,
          leadMessage: message,
          listingUrl,
        });
      }
    }

    return NextResponse.json({ success: true, message: "Lead captured successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
