import Link from "next/link";
import { Metadata } from "next";
import { Calendar, ArrowRight, User } from "lucide-react";
import { getRecentBlogPosts } from "@/lib/data/sample-blog";
import { generatePageMetadata } from "@/lib/seo/metadata";
import AdSlot from "@/components/ads/AdSlot";
import NewsletterSignup from "@/components/lead-gen/NewsletterSignup";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog - Local Business Tips & Guides",
  description:
    "Read the latest guides, tips, and news about local businesses and services in the Piedmont Triad. Find expert advice for homeowners and business owners.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getRecentBlogPosts(10);

  return (
    <div className="container-main py-10">
      <h1 className="section-heading">Triad Directory Blog</h1>
      <p className="section-subheading">
        Expert guides, local tips, and news for Triad residents and business owners
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {posts.map((post, i) => (
            <article
              key={post.slug}
              className={`card overflow-hidden ${i === 0 ? "" : ""}`}
            >
              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {post.author}
                  </span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="mt-2 text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                <p className="mt-2 text-gray-600">{post.excerpt}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Read More <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900">Subscribe</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get new posts and Triad business tips in your inbox.
            </p>
            <div className="mt-3">
              <NewsletterSignup />
            </div>
          </div>

          <AdSlot position="sidebar" />

          <div className="card p-5">
            <h3 className="font-semibold text-gray-900">For Business Owners</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get your business featured in our blog and directory.
            </p>
            <Link href="/advertise" className="btn-primary w-full mt-3 text-sm">
              Advertise With Us
            </Link>
          </div>

          <AdSlot position="sidebar" />
        </aside>
      </div>
    </div>
  );
}
