import { apiClient } from "@/lib/api/client";

/** Ask the website to refresh public pages for a content type straight away (admins only). */
export async function refreshPublicPages(tag: "team" | "events" | "catalogue" | "insights") {
  try {
    const { token } = await apiClient.post<{ token: string }>("/auth/action-token");
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag, token }),
    });
  } catch {
    // Pages still refresh on their own within five minutes.
  }
}
