import Link from "next/link";
import { Metadata } from "next";
import { Tag, MessageCircle, ThumbsUp, CheckCircle } from "lucide-react";
import { getQuestionsByTag, getPopularTags } from "@/lib/data/community";
import { generatePageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import CommunitySidebar from "@/components/community/CommunitySidebar";

interface Props {
  params: { tag: string };
}

export function generateStaticParams() {
  return getPopularTags().map(({ tag }) => ({ tag }));
}

export function generateMetadata({ params }: Props): Metadata {
  const tag = decodeURIComponent(params.tag);
  return generatePageMetadata({
    title: `"${tag}" Questions - Community Q&A`,
    description: `Browse community questions tagged "${tag}" in the Piedmont Triad. Get answers from local experts and business owners.`,
    path: `/community/tag/${params.tag}`,
  });
}

export default function TagPage({ params }: Props) {
  const tag = decodeURIComponent(params.tag);
  const questions = getQuestionsByTag(tag);

  return (
    <>
      <div className="container-main">
        <Breadcrumbs
          items={[
            { label: "Community", href: "/community" },
            { label: `Tag: ${tag}` },
          ]}
        />
      </div>

      <div className="container-main pb-12">
        <div className="flex items-center gap-3 mb-8">
          <Tag className="h-6 w-6 text-primary-600" aria-hidden="true" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Questions tagged &quot;{tag}&quot;
            </h1>
            <p className="text-sm text-gray-500">
              {questions.length} question{questions.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((q) => (
                  <article key={q.id} className="card p-5">
                    <div className="flex gap-4">
                      <div className="hidden sm:flex flex-col items-center gap-1 pt-1">
                        <ThumbsUp className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        <span className="text-sm font-bold text-gray-700">{q.upvotes}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Link href={`/community/${q.slug}`}>
                            <h2 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                              {q.title}
                            </h2>
                          </Link>
                          {q.isResolved && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                              <CheckCircle className="h-3 w-3" aria-hidden="true" />
                              Resolved
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{q.body}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span>by {q.authorName}</span>
                          <span>&middot;</span>
                          <span>
                            {new Date(q.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" aria-hidden="true" />
                            {q.answerCount} answers
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {q.tags.map((t) => (
                            <Link
                              key={t}
                              href={`/community/tag/${t}`}
                              className={`rounded-full px-2.5 py-0.5 text-xs ${
                                t === tag
                                  ? "bg-primary-100 text-primary-700 font-medium"
                                  : "bg-beige-100 text-beige-700"
                              }`}
                            >
                              {t}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
                <p className="text-gray-500">No questions found with tag &quot;{tag}&quot;.</p>
                <Link href="/community/ask" className="btn-primary mt-4">
                  Ask the First Question
                </Link>
              </div>
            )}
          </div>

          <CommunitySidebar />
        </div>
      </div>
    </>
  );
}
