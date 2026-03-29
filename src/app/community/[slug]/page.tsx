import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ThumbsUp, MessageCircle, ArrowLeft, CheckCircle, Building } from "lucide-react";
import { sampleQuestions, getQuestionBySlug, getAnswersByQuestionId } from "@/lib/data/community";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateBreadcrumbJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AdSlot from "@/components/ads/AdSlot";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return sampleQuestions.map((q) => ({ slug: q.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const question = getQuestionBySlug(params.slug);
  if (!question) return {};
  return generatePageMetadata({
    title: question.title,
    description: question.body.slice(0, 160),
    path: `/community/${question.slug}`,
  });
}

export default function QuestionPage({ params }: Props) {
  const question = getQuestionBySlug(params.slug);
  if (!question) notFound();

  const answers = getAnswersByQuestionId(question.id);

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Community", url: "/community" },
          { name: question.title, url: `/community/${question.slug}` },
        ])}
      />

      <div className="container-main">
        <Breadcrumbs
          items={[
            { label: "Community", href: "/community" },
            { label: question.title },
          ]}
        />
      </div>

      <div className="container-main pb-12">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Question */}
            <article className="card p-6">
              <h1 className="text-2xl font-bold text-gray-900">{question.title}</h1>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                <span>Asked by {question.authorName}</span>
                <span>&middot;</span>
                <span>
                  {new Date(question.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-4 text-gray-700 leading-relaxed">{question.body}</p>
              <div className="mt-4 flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                  {question.upvotes} upvotes
                </span>
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  {answers.length} answers
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-beige-100 px-2.5 py-0.5 text-xs text-beige-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>

            {/* Answers */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900">
                {answers.length} Answer{answers.length !== 1 ? "s" : ""}
              </h2>
              <div className="mt-4 space-y-4">
                {answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`card p-5 ${
                      answer.isBusinessOwner
                        ? "border-primary-200 bg-primary-50/30"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <ThumbsUp className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        <span className="text-sm font-bold text-gray-600">{answer.upvotes}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-gray-900">
                            {answer.authorName}
                          </span>
                          {answer.isBusinessOwner && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                              <Building className="h-3 w-3" aria-hidden="true" />
                              Business Owner
                            </span>
                          )}
                          <span className="text-gray-400">
                            &middot;{" "}
                            {new Date(answer.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                          {answer.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/community"
                className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Community
              </Link>
            </div>
          </div>

          <aside className="space-y-6">
            <AdSlot position="sidebar" />
            {question.categorySlug && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900">Find Professionals</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Browse verified businesses in this category.
                </p>
                <Link
                  href={question.citySlug ? `/${question.citySlug}/${question.categorySlug}` : `/categories/${question.categorySlug}`}
                  className="btn-primary w-full mt-3 text-sm"
                >
                  Browse Listings
                </Link>
              </div>
            )}
            <AdSlot position="sidebar" />
          </aside>
        </div>
      </div>
    </>
  );
}
