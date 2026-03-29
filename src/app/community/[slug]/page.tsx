import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ThumbsUp, MessageCircle, ArrowLeft, CheckCircle, Building, Clock, Share2 } from "lucide-react";
import {
  sampleQuestions,
  getQuestionBySlug,
  getAnswersByQuestionId,
  getRecentQuestions,
} from "@/lib/data/community";
import { generatePageMetadata } from "@/lib/seo/metadata";
import { generateBreadcrumbJsonLd, generateQAPageJsonLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import CommunitySidebar from "@/components/community/CommunitySidebar";
import AnswerForm from "@/components/community/AnswerForm";

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
    title: `${question.title} - Community Q&A`,
    description: question.body.slice(0, 160),
    path: `/community/${question.slug}`,
  });
}

export default function QuestionPage({ params }: Props) {
  const question = getQuestionBySlug(params.slug);
  if (!question) notFound();

  const answers = getAnswersByQuestionId(question.id);
  const relatedQuestions = getRecentQuestions(5).filter((q) => q.id !== question.id).slice(0, 3);

  return (
    <>
      <JsonLd
        data={generateBreadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Community", url: "/community" },
          { name: question.title, url: `/community/${question.slug}` },
        ])}
      />
      <JsonLd data={generateQAPageJsonLd(question, answers)} />

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
              <div className="flex items-start gap-2">
                <h1 className="text-2xl font-bold text-gray-900 flex-1">{question.title}</h1>
                {question.isResolved && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200 shrink-0">
                    <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    Resolved
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span>
                  Asked by <strong className="text-gray-700">{question.authorName}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {new Date(question.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {question.citySlug && (
                  <Link
                    href={`/${question.citySlug}`}
                    className="text-primary-600 hover:underline capitalize"
                  >
                    {question.citySlug.replace(/-/g, " ")}
                  </Link>
                )}
              </div>

              <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-line">
                {question.body}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                    {question.upvotes} upvotes
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    {answers.length} answers
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {question.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/community/tag/${tag}`}
                    className="rounded-full bg-beige-100 px-3 py-1 text-xs text-beige-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </article>

            {/* Answers */}
            <div className="mt-8">
              <h2 className="text-lg font-bold text-gray-900">
                {answers.length} Answer{answers.length !== 1 ? "s" : ""}
              </h2>

              <div className="mt-4 space-y-4">
                {answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`card p-5 ${
                      answer.isAccepted
                        ? "border-green-300 bg-green-50/30"
                        : answer.isBusinessOwner
                          ? "border-primary-200 bg-primary-50/20"
                          : ""
                    }`}
                  >
                    {answer.isAccepted && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 mb-3">
                        <CheckCircle className="h-4 w-4" aria-hidden="true" />
                        Accepted Answer
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 pt-1 min-w-[40px]">
                        <ThumbsUp className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        <span className="text-sm font-bold text-gray-600">{answer.upvotes}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="font-semibold text-gray-900">
                            {answer.authorName}
                          </span>
                          {answer.isBusinessOwner && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                              <Building className="h-3 w-3" aria-hidden="true" />
                              {answer.businessSlug ? (
                                <Link
                                  href={`/greensboro/${question.categorySlug || "general-contractors"}/${answer.businessSlug}`}
                                  className="hover:underline"
                                >
                                  {answer.businessName || "Business Owner"}
                                </Link>
                              ) : (
                                answer.businessName || "Business Owner"
                              )}
                            </span>
                          )}
                          <span className="text-gray-400">
                            {new Date(answer.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {answer.body}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Answer Form */}
            <div className="mt-8">
              <AnswerForm
                questionId={question.id}
                questionTitle={question.title}
              />
            </div>

            {/* Related Questions */}
            {relatedQuestions.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-bold text-gray-900">Related Questions</h3>
                <div className="mt-4 space-y-3">
                  {relatedQuestions.map((q) => (
                    <Link
                      key={q.id}
                      href={`/community/${q.slug}`}
                      className="card flex items-center gap-4 p-4 hover:border-primary-200 transition-colors"
                    >
                      <div className="text-center min-w-[40px]">
                        <span className="text-sm font-bold text-gray-700">{q.upvotes}</span>
                        <span className="block text-[10px] text-gray-400">votes</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 hover:text-primary-600 truncate">
                          {q.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {q.answerCount} answers
                          {q.isResolved && " · Resolved"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

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

          {/* Sidebar */}
          <CommunitySidebar />
        </div>
      </div>
    </>
  );
}
