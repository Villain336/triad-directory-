import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import JsonLd from "@/components/seo/JsonLd";
import Analytics from "@/components/Analytics";
import { RecaptchaScript } from "@/components/RecaptchaWrapper";
import { defaultMetadata } from "@/lib/seo/metadata";
import { generateOrganizationJsonLd, generateWebSiteJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Analytics />
        <RecaptchaScript />
        <JsonLd data={generateOrganizationJsonLd()} />
        <JsonLd data={generateWebSiteJsonLd()} />
        <Header />
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
