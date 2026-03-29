"use client";

import { Phone, MessageSquare } from "lucide-react";

interface StickyCallBarProps {
  phone: string;
  businessName: string;
}

export default function StickyCallBar({ phone, businessName }: StickyCallBarProps) {
  const formattedPhone = phone.replace(/\D/g, "");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.1)] lg:hidden">
      <div className="flex gap-2 max-w-lg mx-auto">
        <a
          href={`tel:${formattedPhone}`}
          className="btn-primary flex-1 gap-2 !py-3"
          aria-label={`Call ${businessName}`}
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call Now
        </a>
        <a
          href="#contact-form"
          className="btn-secondary flex-1 gap-2 !py-3"
          aria-label={`Send message to ${businessName}`}
        >
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          Get Quote
        </a>
      </div>
    </div>
  );
}
