import Link from "next/link";

export default function AgencyFooter() {
  return (
    <div className="text-center text-xs text-gray-400 mt-2">
      Built by{" "}
      <a
        href="https://launchabl.io"
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-500 hover:text-primary-400 font-medium"
      >
        Launchabl
      </a>
      {" "}— SEO & Marketing for NC Service Businesses
    </div>
  );
}
