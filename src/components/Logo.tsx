interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "h-8 w-auto", showText = true }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="NC Service Businesses logo"
      >
        {/* Shield shape */}
        <path
          d="M20 2L4 10V20C4 30 12 37 20 39C28 37 36 30 36 20V10L20 2Z"
          fill="#b91c1c"
          stroke="#991b1b"
          strokeWidth="1"
        />
        {/* NC letters */}
        <text
          x="20"
          y="23"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontFamily="system-ui, sans-serif"
          fontWeight="800"
          fontSize="14"
        >
          NC
        </text>
        {/* Small wrench icon at bottom */}
        <path
          d="M16 30L18 28M22 30L24 28"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight text-gray-900">
            NC Service
          </span>
          <span className="text-xs font-semibold leading-tight text-primary-600 -mt-0.5">
            Businesses
          </span>
        </div>
      )}
    </div>
  );
}
