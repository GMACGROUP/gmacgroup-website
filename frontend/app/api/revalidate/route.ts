import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const ALLOWED_TAGS = new Set(["team", "events", "insights", "catalogue"]);

/**
 * Called by the admin panel after a content change so the public pages update
 * immediately instead of waiting for the scheduled refresh. The admin's browser
 * passes a five minute token issued by the API, which the API confirms here.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { tag?: string; token?: string } | null;
  const tag = body?.tag;
  if (!tag || !ALLOWED_TAGS.has(tag)) return NextResponse.json({ ok: false, detail: "Unknown tag" }, { status: 400 });
  if (!body?.token) return NextResponse.json({ ok: false }, { status: 401 });

  const check = await fetch(`${API_BASE_URL}/auth/action-token/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: body.token, action: "revalidate" }),
    cache: "no-store",
  }).catch(() => null);
  if (!check?.ok) return NextResponse.json({ ok: false }, { status: 401 });

  revalidateTag(tag);
  return NextResponse.json({ ok: true, tag });
}
