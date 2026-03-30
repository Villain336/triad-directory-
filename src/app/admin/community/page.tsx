import { createServerClient } from "@/lib/supabase/server";
import { MessageSquare, CheckCircle, Clock } from "lucide-react";

export const revalidate = 60;

async function getQuestions() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("community_questions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  return data || [];
}

export default async function AdminCommunityPage() {
  const questions = await getQuestions();
  const pending = questions.filter((q: any) => q.status === "pending");
  const active = questions.filter((q: any) => q.status === "active");

  return (
    <div className="container-main py-8">
      <h1 className="text-2xl font-bold text-gray-900">Community Moderation</h1>
      <p className="mt-1 text-sm text-gray-500">
        {pending.length} pending · {active.length} active
      </p>

      {pending.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Pending Review ({pending.length})
          </h2>
          <div className="mt-3 space-y-3">
            {pending.map((q: any) => (
              <div key={q.id} className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <h3 className="font-medium text-gray-900">{q.title}</h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{q.body}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                  <span>by {q.author_name}</span>
                  <span>{new Date(q.created_at).toLocaleDateString()}</span>
                  {q.city_slug && <span>City: {q.city_slug}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Active Questions ({active.length})
        </h2>
        {active.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400">No active community questions yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {active.map((q: any) => (
              <div key={q.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="font-medium text-gray-900">{q.title}</h3>
                <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                  <span>by {q.author_name}</span>
                  <span>{new Date(q.created_at).toLocaleDateString()}</span>
                  <span>{q.upvotes} upvotes</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
