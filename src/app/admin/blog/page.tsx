import { createServerClient } from "@/lib/supabase/server";
import { FileText, Plus } from "lucide-react";

export const revalidate = 60;

async function getBlogPosts() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  return data || [];
}

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container-main py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="mt-1 text-sm text-gray-500">{posts.length} posts in database</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-primary-50 border border-primary-200 p-4">
        <p className="text-sm text-primary-800">
          <strong>Note:</strong> Blog posts are currently served from static data files.
          To add posts via the database, insert them into the <code className="bg-primary-100 px-1 rounded">blog_posts</code> table
          with <code className="bg-primary-100 px-1 rounded">status = &apos;published&apos;</code> in Supabase.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="mt-6 rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-gray-500">No blog posts in the database yet.</p>
          <p className="mt-1 text-sm text-gray-400">Static blog posts are served from src/lib/data/sample-blog.ts</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-3 px-4 text-left font-medium text-gray-700">Title</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Status</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Author</th>
                <th className="py-3 px-4 text-left font-medium text-gray-700">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post: any) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{post.title}</td>
                  <td className="py-3 px-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      post.status === "published" ? "bg-green-100 text-green-700" :
                      post.status === "draft" ? "bg-yellow-100 text-yellow-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{post.author_name}</td>
                  <td className="py-3 px-4 text-gray-500">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
