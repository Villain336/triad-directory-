import { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { SUPPORT_EMAIL, PHONE } from "@/lib/constants";
import ContactForm from "@/components/lead-gen/ContactForm";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Triad Directory. Questions about advertising, listings, or partnerships? We're here to help.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container-main py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="section-heading text-center">Contact Us</h1>
        <p className="section-subheading text-center">
          Have a question or want to discuss advertising? We&apos;d love to hear from you.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="card p-6">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900">Get in Touch</h3>
              <div className="mt-4 space-y-4">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600"
                >
                  <Mail className="h-5 w-5 text-gray-400" />
                  {SUPPORT_EMAIL}
                </a>
                <a
                  href={`tel:${PHONE}`}
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary-600"
                >
                  <Phone className="h-5 w-5 text-gray-400" />
                  {PHONE}
                </a>
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <span>
                    Serving the Piedmont Triad
                    <br />
                    North Carolina
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-gray-900">Business Hours</h3>
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p>Monday - Friday: 9am - 5pm</p>
                <p>Saturday: 10am - 2pm</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
