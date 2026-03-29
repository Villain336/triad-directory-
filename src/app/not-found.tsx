import Link from "next/link";
import { Search, Home, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-main py-20 text-center">
      <MapPin className="mx-auto h-16 w-16 text-gray-300" />
      <h1 className="mt-6 text-3xl font-bold text-gray-900">Page Not Found</h1>
      <p className="mt-3 text-gray-600 max-w-md mx-auto">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. Try searching for
        what you need or browse our directory.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary gap-2">
          <Home className="h-4 w-4" />
          Go Home
        </Link>
        <Link href="/search" className="btn-secondary gap-2">
          <Search className="h-4 w-4" />
          Search Directory
        </Link>
      </div>
    </div>
  );
}
