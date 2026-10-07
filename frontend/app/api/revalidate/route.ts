import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const ALLOWED_TAGS = new Set(["team", "events", "insights"]);

/**
 * Called by the admin panel after a content change so the public pages update
 * immediately instead of waiting for the scheduled refresh. The caller's
 * token is checked against the API and must belong to an admin.
 */
export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ ok: false }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { tag?: string } | null;
  const tag = body?.tag;
  if (!tag || !ALLOWED_TAGS.has(tag)) return NextResponse.json({ ok: false, detail: "Unknown tag" }, { status: 400 });

  const me = await fetch(`${API_BASE_URL}/auth/me`, { headers: { Authorization: auth }, cache: "no-store" }).catch(() => null);
  if (!me?.ok) return NextResponse.json({ ok: false }, { status: 401 });
  const user = (await me.json().catch(() => null)) as { role?: string } | null;
  if (!user || user.role !== "admin") {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  revalidateTag(tag);
  return NextResponse.json({ ok: true, tag });
}
