import { Metadata } from "next";
import Link from "next/link";
import {
  CreditCard,
  Users,
  Zap,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Shield,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo/metadata";
import CheckoutButton from "@/components/CheckoutButton";

export const metadata: Metadata = generatePageMetadata({
  title: "Pay-Per-Lead — Only Pay When You Get a Lead",
  description:
    "No monthly commitment. Buy lead credits and only pay when a customer reaches out. Flexible pay-per-lead pricing for NC service businesses.",
  path: "/pay-per-lead",
});

const LEAD_PACKS = [
  {
    addon: "leadPack10",
    leads: 10,
    price: 49,
    perLead: "4.90",
    badge: null,
    color: "border-gray-200",
    btnClass:
      "w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors",
  },
  {
    addon: "leadPack25",
    leads: 25,
    price: 99,
    perLead: "3.96",
    badge: "Best Value",
    color: "border-primary-400 ring-2 ring-primary-200",
    btnClass:
      "w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors",
  },
  {
    addon: "leadPack50",
    leads: 50,
    price: 149,
    perLead: "2.98",
    badge: "Most Popular",
    color: "border-amber-400 ring-2 ring-amber-100",
    btnClass:
      "w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors",
  },
];

const STEPS = [
  {
    icon: CreditCard,
    step: "1",
    title: "Buy a Credit Pack",
    description:
      "Choose how many leads you want. Credits never expire — use them at your own pace.",
  },
  {
    icon: Users,
    step: "2",
    title: "We Match You With Customers",
    description:
      "When someone in the Piedmont Triad searches for your service category, we surface your listing.",
  },
  {
    icon: Zap,
    step: "3",
    title: "Credits Deducted Per Lead",
    description:
      "Each time a qualified customer contacts you through your listing, one credit is deducted.",
  },
];

const COMPARISON = [
  {
    feature: "Monthly cost",
    subscription: "$49–$199/mo",
    payPerLead: "Only what you spend",
  },
  {
    feature: "Leads included",
    subscription: "Unlimited",
    payPerLead: "Pay per lead",
  },
  {
    feature: "Best for",
    subscription: "High-volume businesses",
    payPerLead: "Seasonal or growing businesses",
  },
  {
    feature: "Commitment",
    subscription: "Monthly recurring",
    payPerLead: "None — buy as needed",
  },
  {
    feature: "Cost per lead",
    subscription: "Decreases with more leads",
    payPerLead: "As low as $2.98/lead",
  },
  {
    feature: "Credits expiry",
    subscription: "N/A",
    payPerLead: "Never expire",
  },
];

const FAQS = [
  {
    q: "What counts as a lead?",
    a: "A lead is when a customer contacts you directly via phone call, form submission, or clicks a call-to-action through your listing. Passive page views do not use credits.",
  },
  {
    q: "Do credits expire?",
    a: "No. Lead credits never expire. Buy a pack today and use them whenever you're ready.",
  },
  {
    q: "Can I use pay-per-lead alongside a subscription?",
    a: "Yes. You can hold an active subscription for unlimited inbound leads and still top up with credit packs for any overflow or promotional campaigns.",
  },
  {
    q: "What happens if I run out of credits?",
    a: "Your listing remains active and visible in the directory. No leads will be deducted, and customers can still find you organically. You'll receive a low-balance notification so you can top up.",
  },
  {
    q: "Can I get a refund on unused credits?",
    a: "We offer refunds on unused credits within 30 days of purchase. Contact our support team and we'll take care of it.",
  },
];

export default function PayPerLeadPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-20 px-4">
        <div className="container-main text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 mb-4">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            Pay-Per-Lead Model
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Only Pay When You<br className="hidden sm:block" /> Get a Lead
          </h1>
          <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
            No monthly subscription required. Buy lead credits and let them work for you.
            When a customer reaches out, one credit is deducted — nothing more.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#pricing" className="btn-primary">
              See Pricing
            </a>
            <Link href="/pricing" className="btn-secondary">
              View Subscription Plans
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
              Credits never expire
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
              No hidden fees
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
              Cancel anytime
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Simple three-step process to start getting qualified leads for your business.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3 relative">
            {/* Connector line (desktop) */}
            <div className="hidden sm:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-primary-100" />
            {STEPS.map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="flex items-center justify-center mx-auto mb-4 h-16 w-16 rounded-full bg-primary-50 border-2 border-primary-100">
                  <step.icon className="h-7 w-7 text-primary-600" aria-hidden="true" />
                </div>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white mb-2">
                  {step.step}
                </span>
                <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Credit Pack Pricing</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Buy more credits, pay less per lead. No subscription required.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
            {LEAD_PACKS.map((pack) => (
              <div
                key={pack.addon}
                className={`relative card p-6 ${pack.color} flex flex-col`}
              >
                {pack.badge && (
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-xs font-semibold whitespace-nowrap ${
                      pack.badge === "Best Value"
                        ? "bg-primary-600 text-white"
                        : "bg-amber-500 text-white"
                    }`}
                  >
                    {pack.badge}
                  </span>
                )}
                <div className="text-center mb-5">
                  <p className="text-4xl font-extrabold text-gray-900">${pack.price}</p>
                  <p className="mt-1 text-sm text-gray-500">one-time payment</p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" aria-hidden="true" />
                    <span>{pack.leads} lead credits</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" aria-hidden="true" />
                    <span>${pack.perLead} per lead</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0" aria-hidden="true" />
                    <span>Credits never expire</span>
                  </li>
                </ul>
                <CheckoutButton
                  addon={pack.addon}
                  label={`Buy ${pack.leads} Credits`}
                  className={pack.btnClass}
                />
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-sm text-gray-400">
            All payments are processed securely via Stripe. Credits are added instantly after payment.
          </p>
        </div>
      </section>

      {/* Subscription vs Pay-Per-Lead Comparison */}
      <section className="py-20 px-4 bg-white">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Subscription vs. Pay-Per-Lead</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Not sure which model fits your business? Here&apos;s a side-by-side comparison.
            </p>
          </div>
          <div className="max-w-3xl mx-auto overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-left font-semibold text-gray-700 w-1/3">Feature</th>
                  <th className="py-3 px-4 text-center font-semibold text-primary-700">
                    <div className="flex items-center justify-center gap-1.5">
                      <TrendingUp className="h-4 w-4" aria-hidden="true" />
                      Subscription
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center font-semibold text-amber-700">
                    <div className="flex items-center justify-center gap-1.5">
                      <Zap className="h-4 w-4" aria-hidden="true" />
                      Pay-Per-Lead
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-700 font-medium">{row.feature}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{row.subscription}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{row.payPerLead}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Want the best of both worlds? Combine a subscription with pay-per-lead credits.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="#pricing" className="btn-primary inline-flex items-center gap-1.5">
                Buy Lead Credits
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link href="/pricing" className="btn-secondary inline-flex items-center gap-1.5">
                See Subscription Plans
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 px-4 bg-primary-50">
        <div className="container-main">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            <div>
              <Shield className="h-8 w-8 text-primary-600 mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-gray-900">Secure Payments</h3>
              <p className="mt-1 text-sm text-gray-500">
                All transactions are encrypted and processed by Stripe.
              </p>
            </div>
            <div>
              <Zap className="h-8 w-8 text-primary-600 mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-gray-900">Instant Credits</h3>
              <p className="mt-1 text-sm text-gray-500">
                Credits are added to your account immediately after payment confirmation.
              </p>
            </div>
            <div>
              <Users className="h-8 w-8 text-primary-600 mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-gray-900">Qualified Leads Only</h3>
              <p className="mt-1 text-sm text-gray-500">
                Credits are only deducted when a real customer actively contacts your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-white">
        <div className="container-main max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-5">
            {FAQS.map((faq) => (
              <div key={faq.q} className="card p-5">
                <h3 className="flex items-start gap-2 font-semibold text-gray-900 text-sm">
                  <HelpCircle
                    className="h-4 w-4 text-primary-500 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm text-gray-600 pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-primary-50">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Get More Leads?</h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto">
            Join hundreds of Piedmont Triad businesses already using Triad Directory to grow.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            {LEAD_PACKS.map((pack) => (
              <CheckoutButton
                key={pack.addon}
                addon={pack.addon}
                label={`${pack.leads} Credits — $${pack.price}`}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
                  pack.badge === "Best Value"
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : pack.badge === "Most Popular"
                    ? "bg-amber-500 text-white hover:bg-amber-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/dashboard" className="text-primary-600 hover:underline">
              Go to your dashboard
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
