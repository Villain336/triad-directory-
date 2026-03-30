interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "h-10 w-auto", showText = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/ncsb-logo.png"
        alt="NC Service Businesses"
        className={className}
      />
    </div>
  );
}
