interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "h-24 w-auto", showText = false }: LogoProps) {
  return (
    <img
      src="/ncsb-logo.png"
      alt="NC Service Businesses"
      className={className}
    />
  );
}
