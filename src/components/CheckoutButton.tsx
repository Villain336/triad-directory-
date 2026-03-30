"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface CheckoutButtonProps {
  tier?: string;
  addon?: string;
  label: string;
  className?: string;
}

export default function CheckoutButton({ tier, addon, label, className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          addon,
          businessId: "pending",
          email: undefined,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleCheckout} disabled={loading} className={className}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : label}
    </button>
  );
}
