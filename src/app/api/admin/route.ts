import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

const ADMIN_KEY = process.env.ADMIN_API_KEY || "ncsb-admin-key";

function verifyAdmin(request: NextRequest) {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${ADMIN_KEY}`;
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action, table, id, data } = body;
  const supabase = createServerClient();

  try {
    switch (action) {
      case "update": {
        const { error } = await supabase.from(table).update(data).eq("id", id);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }
      case "delete": {
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }
      case "approve": {
        const { error } = await supabase.from(table).update({ status: "active" }).eq("id", id);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }
      case "reject": {
        const { error } = await supabase.from(table).update({ status: "suspended" }).eq("id", id);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }
      case "upgrade_tier": {
        const { error } = await supabase
          .from("businesses")
          .update({ tier: data.tier, is_verified: true, is_featured: data.tier !== "free" })
          .eq("id", id);
        if (error) throw error;
        return NextResponse.json({ success: true });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
