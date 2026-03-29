import Link from "next/link";
import { Metadata } from "next";
import { AlertTriangle, Phone, Clock, MapPin, Shield } from "lucide-react";
import { getFeaturedCities } from "@/lib/data/cities";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { formatPhone } from "@/lib/utils";

export const metadata: Metadata = generatePageMetadata({
  title: "24/7 Emergency Services in the Triad",
  description:
    "Find emergency plumbers, electricians, HVAC repair, locksmiths, and more available 24/7 in the Piedmont Triad. Get help now.",
  path: "/emergency",
});

const emergencyCategories = [
  {
    name: "Emergency Plumber",
    slug: "plumbers",
    description: "Burst pipes, flooding, sewer backups, water heater failures",
    phone: "3365551001",
    available: "24/7",
  },
  {
    name: "Emergency Electrician",
    slug: "electricians",
    description: "Power outages, sparking outlets, electrical fires, panel failures",
    phone: "3365551002",
    available: "24/7",
  },
  {
    name: "Emergency HVAC",
    slug: "hvac",
    description: "AC failure in summer, no heat in winter, gas leaks",
    phone: "3365551003",
    available: "24/7",
  },
  {
    name: "Emergency Roofer",
    slug: "roofing",
    description: "Storm damage, leaks, fallen trees, tarping services",
    phone: "3365551004",
    available: "After hours available",
  },
  {
    name: "Emergency Towing",
    slug: "towing",
    description: "Breakdowns, accidents, roadside assistance, lockouts",
    phone: "3365551020",
    available: "24/7",
  },
];

export default function EmergencyPage() {
  const cities = getFeaturedCities();

  return (
    <>
      {/* Urgent Header */}
      <section className="bg-primary-700 text-white">
        <div className="container-main py-10 sm:py-14">
          <div className="flex items-center gap-2 text-primary-200 text-sm mb-2">
            <AlertTriangle className="h-5 w-5 text-accent-400" aria-hidden="true" />
            Available Now
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            24/7 Emergency Services in the Triad
          </h1>
          <p className="mt-3 max-w-2xl text-primary-200 text-lg">
            Need help right now? Our emergency service directory connects you with
            professionals available around the clock across the Piedmont Triad.
          </p>
        </div>
      </section>

      <div className="container-main py-10">
        {/* Emergency Contacts */}
        <div className="space-y-4">
          {emergencyCategories.map((cat) => (
            <div
              key={cat.slug}
              className="card overflow-hidden border-primary-200"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="flex-1 p-5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">{cat.name}</h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 border border-green-200">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {cat.available}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{cat.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/${city.slug}/${cat.slug}`}
                        className="rounded-full bg-beige-100 px-2.5 py-1 text-xs text-gray-600 hover:bg-primary-50 hover:text-primary-700"
                      >
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center bg-primary-50 p-5 sm:w-64">
                  <a
                    href={`tel:${cat.phone}`}
                    className="btn-primary gap-2 w-full justify-center"
                  >
                    <Phone className="h-5 w-5" aria-hidden="true" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Safety Tips */}
        <section className="mt-12 card p-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary-600" aria-hidden="true" />
            Emergency Safety Tips
          </h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-semibold text-gray-900">Plumbing Emergency</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>1. Turn off the main water supply valve</li>
                <li>2. Open faucets to relieve pressure</li>
                <li>3. Turn off water heater if leaking</li>
                <li>4. Call a licensed emergency plumber</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Electrical Emergency</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>1. Do NOT touch sparking outlets or wires</li>
                <li>2. Turn off the main breaker if safe to do so</li>
                <li>3. Evacuate if you smell burning</li>
                <li>4. Call 911 for fires, then an electrician</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">HVAC Emergency</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>1. If you smell gas, leave immediately and call 911</li>
                <li>2. Turn off the system at the thermostat</li>
                <li>3. Check your breaker panel</li>
                <li>4. Call an HVAC technician for diagnosis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Storm Damage</h3>
              <ul className="mt-2 space-y-1 text-sm text-gray-600">
                <li>1. Stay away from downed power lines</li>
                <li>2. Document damage with photos</li>
                <li>3. Call your insurance company</li>
                <li>4. Contact a roofer for emergency tarping</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
