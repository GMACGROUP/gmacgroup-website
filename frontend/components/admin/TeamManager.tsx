"use client";

import { useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { TEAMS } from "@/lib/content/site";

type Member = {
  id: string;
  name: string;
  position: string;
  country: string;
  team: string;
  bio: string | null;
  linkedin_url: string | null;
  photo_url: string | null;
  is_lead: boolean;
  is_published: boolean;
  sort_order: number;
};

type Draft = Omit<Member, "id" | "photo_url" | "sort_order"> & { id?: string };

const EMPTY: Draft = {
  name: "",
  position: "",
  country: "",
  team: TEAMS[0].name,
  bio: "",
  linkedin_url: "",
  is_lead: false,
  is_published: true,
};

const MAX_MB = 5;

export function TeamManager() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [photoTarget, setPhotoTarget] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setMembers(await apiClient.get<Member[]>("/admin/team"));
    } catch (e) {
      setNotice({ kind: "error", text: e instanceof Error ? e.message : "Could not load the team." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  /** Ask the website to refresh the public Team page straight away. */
  function publish() {
    let token: string | null = null;
    try {
      token = localStorage.getItem("gmac_auth_token");
    } catch {}
    if (!token) return;
    fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ tag: "team" }),
    }).catch(() => undefined);
  }

  function flash(kind: "ok" | "error", text: string) {
    if (kind === "ok") publish();
    setNotice({ kind, text });
    if (kind === "ok") window.setTimeout(() => setNotice(null), 4000);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setBusy("save");
    const body = {
      name: draft.name,
      position: draft.position,
      country: draft.country,
      team: draft.team,
      bio: draft.bio || null,
      linkedin_url: draft.linkedin_url || null,
      is_lead: draft.is_lead,
      is_published: draft.is_published,
    };
    try {
      if (draft.id) {
        const updated = await apiClient.patch<Member>(`/admin/team/${draft.id}`, body);
        setMembers((m) => m.map((x) => (x.id === updated.id ? updated : x)));
        flash("ok", `${updated.name} updated.`);
      } else {
        const sort_order = (members.at(-1)?.sort_order ?? 0) + 10;
        const created = await apiClient.post<Member>("/admin/team", { ...body, sort_order });
        setMembers((m) => [...m, created]);
        flash("ok", `${created.name} added. Upload a photo next.`);
      }
      setDraft(null);
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(null);
    }
  }

  async function patch(id: string, body: Partial<Member>, done: string) {
    setBusy(id);
    try {
      const updated = await apiClient.patch<Member>(`/admin/team/${id}`, body);
      setMembers((m) => m.map((x) => (x.id === id ? updated : x)));
      flash("ok", done);
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusy(null);
    }
  }

  async function remove(m: Member) {
    if (!window.confirm(`Remove ${m.name} from the team page? This cannot be undone.`)) return;
    setBusy(m.id);
    try {
      await apiClient.delete(`/admin/team/${m.id}`);
      setMembers((list) => list.filter((x) => x.id !== m.id));
      flash("ok", `${m.name} removed.`);
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Could not remove.");
    } finally {
      setBusy(null);
    }
  }

  async function move(index: number, dir: -1 | 1) {
    const next = [...members];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    setMembers(next);
    try {
      setMembers(await apiClient.post<Member[]>("/admin/team/reorder", { ids: next.map((m) => m.id) }));
      publish();
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Could not reorder.");
      load();
    }
  }

  async function removePhoto(m: Member) {
    setBusy(m.id);
    try {
      const updated = await apiClient.delete<Member>(`/admin/team/${m.id}/photo`);
      setMembers((list) => list.map((x) => (x.id === m.id ? updated : x)));
      flash("ok", `Photo removed for ${m.name}.`);
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Could not remove the photo.");
    } finally {
      setBusy(null);
    }
  }

  function pickPhoto(id: string) {
    setPhotoTarget(id);
    fileInput.current?.click();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !photoTarget) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      flash("error", "Please choose a JPG, PNG or WebP photo.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      flash("error", `That photo is larger than ${MAX_MB}MB. Please resize it and try again.`);
      return;
    }
    setBusy(photoTarget);
    try {
      const updated = await apiClient.upload<Member>(`/admin/team/${photoTarget}/photo`, file);
      setMembers((m) => m.map((x) => (x.id === updated.id ? updated : x)));
      flash("ok", `Photo saved for ${updated.name}.`);
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(null);
      setPhotoTarget(null);
    }
  }

  const field = "w-full border border-slate-300 bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none";

  return (
    <section className="space-y-6" aria-labelledby="team-admin-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="team-admin-title" className="font-display text-2xl text-ink">Team page</h2>
          <p className="mt-1 text-sm text-slate-600">
            Changes go live on the public Team page as soon as you save. Hidden people stay here but are not shown.
          </p>
        </div>
        <button type="button" className="btn-primary !py-2.5" onClick={() => setDraft({ ...EMPTY })}>
          Add a person
        </button>
      </div>

      {notice && (
        <p
          role={notice.kind === "error" ? "alert" : "status"}
          className={`border px-4 py-3 text-sm ${notice.kind === "error" ? "border-red-200 bg-red-50 text-danger" : "border-emerald-200 bg-emerald-50 text-success"}`}
        >
          {notice.text}
        </p>
      )}

      <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFile} aria-hidden="true" tabIndex={-1} />

      {draft && (
        <form onSubmit={save} className="grid gap-4 border border-slate-200 bg-white p-6 sm:grid-cols-2">
          <h3 className="font-sans text-base font-semibold text-ink sm:col-span-2">{draft.id ? `Edit ${draft.name}` : "Add a person"}</h3>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Full name *</span>
            <input required maxLength={120} className={field} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Position *</span>
            <input required maxLength={160} className={field} value={draft.position} onChange={(e) => setDraft({ ...draft, position: e.target.value })} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Country *</span>
            <input required minLength={2} maxLength={80} className={field} value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Team *</span>
            <select className={field} value={draft.team} onChange={(e) => setDraft({ ...draft, team: e.target.value })}>
              {TEAMS.map((t) => (
                <option key={t.name}>{t.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">LinkedIn profile (optional)</span>
            <input
              type="url"
              placeholder="https://www.linkedin.com/in/..."
              pattern="https://(www\.)?linkedin\.com/.*"
              className={field}
              value={draft.linkedin_url ?? ""}
              onChange={(e) => setDraft({ ...draft, linkedin_url: e.target.value })}
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Short bio (optional)</span>
            <textarea maxLength={1200} rows={3} className={field} value={draft.bio ?? ""} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.is_lead} onChange={(e) => setDraft({ ...draft, is_lead: e.target.checked })} />
            Team lead
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.is_published} onChange={(e) => setDraft({ ...draft, is_published: e.target.checked })} />
            Show on the website
          </label>
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={busy === "save"} className="btn-dark !py-2.5 disabled:opacity-50">
              {busy === "save" ? "Saving..." : "Save"}
            </button>
            <button type="button" className="btn-secondary !py-2.5" onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading team...</p>
      ) : (
        <ul className="divide-y divide-slate-200 border border-slate-200 bg-white">
          {members.map((m, i) => (
            <li key={m.id} className={`flex flex-wrap items-center gap-4 p-4 ${m.is_published ? "" : "bg-slate-50 opacity-70"}`}>
              <div className="h-16 w-14 shrink-0 overflow-hidden bg-stone">
                {m.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-slate-400">No photo</span>
                )}
              </div>
              <div className="min-w-[12rem] flex-1">
                <p className="font-medium text-ink">
                  {m.name} {m.is_lead && <span className="ml-1 text-xs uppercase tracking-wide text-clay">Lead</span>}
                  {!m.is_published && <span className="ml-2 text-xs text-slate-500">(hidden)</span>}
                </p>
                <p className="text-sm text-slate-600">
                  {m.position}, {m.country}
                </p>
                <p className="text-xs text-slate-400">{m.team}</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button type="button" aria-label={`Move ${m.name} up`} disabled={i === 0} onClick={() => move(i, -1)} className="border border-slate-300 px-2 py-1.5 disabled:opacity-30">
                  ↑
                </button>
                <button type="button" aria-label={`Move ${m.name} down`} disabled={i === members.length - 1} onClick={() => move(i, 1)} className="border border-slate-300 px-2 py-1.5 disabled:opacity-30">
                  ↓
                </button>
                <button type="button" disabled={busy === m.id} onClick={() => pickPhoto(m.id)} className="border border-slate-300 px-3 py-1.5 hover:border-ink">
                  {busy === m.id && photoTarget === m.id ? "Uploading..." : m.photo_url ? "Change photo" : "Upload photo"}
                </button>
                {m.photo_url && (
                  <button type="button" onClick={() => removePhoto(m)} className="border border-slate-300 px-3 py-1.5 hover:border-ink">
                    Remove photo
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDraft({ id: m.id, name: m.name, position: m.position, country: m.country, team: m.team, bio: m.bio ?? "", linkedin_url: m.linkedin_url ?? "", is_lead: m.is_lead, is_published: m.is_published })}
                  className="border border-slate-300 px-3 py-1.5 hover:border-ink"
                >
                  Edit
                </button>
                <button type="button" onClick={() => patch(m.id, { is_published: !m.is_published }, m.is_published ? `${m.name} hidden.` : `${m.name} is visible again.`)} className="border border-slate-300 px-3 py-1.5 hover:border-ink">
                  {m.is_published ? "Hide" : "Show"}
                </button>
                <button type="button" onClick={() => remove(m)} className="border border-red-200 px-3 py-1.5 text-danger hover:bg-red-50">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
