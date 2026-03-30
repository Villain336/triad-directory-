export default function AgencyFooter() {
  return (
    <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-2">
      <span>Built by</span>
      <a
        href="https://launchabl.io"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-orange-500 hover:text-orange-600 font-medium transition-colors"
      >
        <img src="/launchabl-logo.png" alt="Launchabl" className="h-4 w-auto" />
        Launchabl
      </a>
      <span>— SEO & Marketing for NC Service Businesses</span>
    </div>
  );
}
