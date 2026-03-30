import { Mail, Phone, MessageSquare, Calendar } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 60;

async function getLeads() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  return data || [];
}

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div className="container-main py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">{leads.length} leads captured</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {leads.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-gray-500">No leads yet. They&apos;ll appear here when visitors submit forms on your site.</p>
          </div>
        ) : (
          leads.map((lead: any) => (
            <div key={lead.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{lead.name || "Anonymous"}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      lead.source === "quote_request" ? "bg-green-100 text-green-700" :
                      lead.source === "contact_form" ? "bg-blue-100 text-blue-700" :
                      lead.source === "newsletter" ? "bg-purple-100 text-purple-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {lead.source?.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-primary-600">
                        <Mail className="h-3.5 w-3.5" /> {lead.email}
                      </a>
                    )}
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-primary-600">
                        <Phone className="h-3.5 w-3.5" /> {lead.phone}
                      </a>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(lead.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </span>
                  </div>
                  {lead.message && (
                    <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{lead.message}</p>
                  )}
                  {(lead.city_slug || lead.category_slug) && (
                    <div className="mt-2 flex gap-2 text-xs text-gray-400">
                      {lead.city_slug && <span>City: {lead.city_slug}</span>}
                      {lead.category_slug && <span>Category: {lead.category_slug}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
