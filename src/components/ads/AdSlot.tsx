interface AdSlotProps {
  position: "banner-top" | "banner-bottom" | "sidebar" | "in-feed";
  className?: string;
}

export default function AdSlot({ position, className = "" }: AdSlotProps) {
  const dimensions: Record<string, { label: string; height: string }> = {
    "banner-top": { label: "728x90 Leaderboard", height: "h-[90px]" },
    "banner-bottom": { label: "728x90 Leaderboard", height: "h-[90px]" },
    sidebar: { label: "300x250 Medium Rectangle", height: "h-[250px]" },
    "in-feed": { label: "Sponsored Listing", height: "h-auto" },
  };

  const dim = dimensions[position];

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 ${dim.height} ${className}`}
      data-ad-slot={position}
    >
      <div className="flex h-full items-center justify-center text-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Advertisement
          </p>
          <p className="mt-1 text-xs text-gray-400">{dim.label}</p>
          <a
            href="/advertise"
            className="mt-2 inline-block text-xs text-primary-500 hover:text-primary-600"
          >
            Your Ad Here
          </a>
        </div>
      </div>
    </div>
  );
}
