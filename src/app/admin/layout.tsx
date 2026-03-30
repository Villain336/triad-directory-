import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | NC Service Businesses",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white">
        <div className="container-main flex items-center justify-between py-3">
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold">NCSB Admin</span>
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <a href="/admin" className="text-gray-300 hover:text-white">Dashboard</a>
              <a href="/admin/listings" className="text-gray-300 hover:text-white">Listings</a>
              <a href="/admin/leads" className="text-gray-300 hover:text-white">Leads</a>
              <a href="/admin/blog" className="text-gray-300 hover:text-white">Blog</a>
              <a href="/admin/community" className="text-gray-300 hover:text-white">Community</a>
              <a href="/admin/analytics" className="text-gray-300 hover:text-white">Analytics</a>
            </nav>
          </div>
          <a href="/" className="text-xs text-gray-400 hover:text-white">← Back to site</a>
        </div>
      </div>
      {children}
    </div>
  );
}
