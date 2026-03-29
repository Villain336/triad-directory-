import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";
import { sampleBlogPosts, getBlogPostBySlug, getRecentBlogPosts } from "@/lib/data/sample-blog";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateBlogPostJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AdSlot from "@/components/ads/AdSlot";
import NewsletterSignup from "@/components/lead-gen/NewsletterSignup";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return sampleBlogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return {};
  return generatePageMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
  });
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const recentPosts = getRecentBlogPosts(5).filter((p) => p.slug !== post.slug);

  return (
    <>
      <JsonLd data={generateBlogPostJsonLd(post)} />
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ])}
      />

      <div className="container-main">
        <Breadcrumbs
          items={[
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />
      </div>

      <article className="container-main pb-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <header>
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
              <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-3 text-lg text-gray-600">{post.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <AdSlot position="banner-top" className="mt-6" />

            <div className="mt-8 prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">
              {post.content.split("\n\n").map((paragraph, i) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={i}>{paragraph.replace("## ", "")}</h2>
                  );
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={i}>{paragraph.replace("### ", "")}</h3>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  const items = paragraph.split("\n").filter(Boolean);
                  return (
                    <ul key={i}>
                      {items.map((item, j) => (
                        <li key={j}>{item.replace(/^- \*\*(.+?)\*\*:?\s*/, "$1: ").replace(/^- /, "")}</li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.match(/^\d+\. /)) {
                  const items = paragraph.split("\n").filter(Boolean);
                  return (
                    <ol key={i}>
                      {items.map((item, j) => (
                        <li key={j}>{item.replace(/^\d+\.\s*/, "")}</li>
                      ))}
                    </ol>
                  );
                }
                return <p key={i}>{paragraph}</p>;
              })}
            </div>

            {/* CTA */}
            <div className="mt-10 rounded-xl bg-primary-50 border border-primary-200 p-6 text-center">
              <h3 className="text-lg font-bold text-gray-900">
                Find Top-Rated Businesses in the Triad
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Browse verified, reviewed businesses across the Piedmont Triad.
              </p>
              <div className="mt-4 flex justify-center gap-3">
                {post.citySlug && post.categorySlug ? (
                  <Link
                    href={`/${post.citySlug}/${post.categorySlug}`}
                    className="btn-primary"
                  >
                    Browse Listings
                  </Link>
                ) : (
                  <Link href="/search" className="btn-primary">
                    Search Directory
                  </Link>
                )}
              </div>
            </div>

            <AdSlot position="banner-bottom" className="mt-6" />

            {/* Back to Blog */}
            <div className="mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Blog
              </Link>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900">Subscribe</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get new posts in your inbox.
              </p>
              <div className="mt-3">
                <NewsletterSignup />
              </div>
            </div>

            <AdSlot position="sidebar" />

            <div className="card p-5">
              <h3 className="font-semibold text-gray-900">Recent Posts</h3>
              <ul className="mt-3 space-y-3">
                {recentPosts.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="block text-sm text-gray-700 hover:text-primary-600"
                    >
                      {p.title}
                    </Link>
                    <span className="text-xs text-gray-400">
                      {new Date(p.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <AdSlot position="sidebar" />
          </aside>
        </div>
      </article>
    </>
  );
}
