"use client";

import { useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { refreshPublicPages } from "@/lib/api/revalidate";
import { FORMAT_LABEL, dateLine, isPast, type GmacEvent } from "@/lib/events";

type AdminEvent = GmacEvent & { is_published: boolean };

const TIMEZONES = ["Africa/Accra", "Africa/Lagos", "Africa/Nairobi", "Africa/Johannesburg", "UTC", "Europe/London", "America/New_York"];
const MAX_MB = 5;

/* datetime-local values are wall-clock times in the event's own time zone. */
function tzOffsetMs(utcMs: number, tz: string) {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).formatToParts(new Date(utcMs));
  const v = (t: string) => Number(p.find((x) => x.type === t)?.value);
  return Date.UTC(v("year"), v("month") - 1, v("day"), v("hour"), v("minute"), v("second")) - utcMs;
}
function localToUtcIso(local: string, tz: string) {
  if (!local) return null;
  const [d, t] = local.split("T");
  const [y, m, day] = d.split("-").map(Number);
  const [hh, mm] = (t || "00:00").split(":").map(Number);
  const guess = Date.UTC(y, m - 1, day, hh, mm);
  return new Date(guess - tzOffsetMs(guess, tz)).toISOString();
}
function utcToLocal(iso: string | null | undefined, tz: string) {
  if (!iso) return "";
  const ms = new Date(iso).getTime() + tzOffsetMs(new Date(iso).getTime(), tz);
  return new Date(ms).toISOString().slice(0, 16);
}
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 150);

type Draft = {
  id?: string; slug: string; title: string; summary: string; body: string; series: string; format: string; location: string;
  start: string; end: string; timezone: string; all_day: boolean; date_label: string; partners: string;
  registration_url: string; recording_url: string; is_featured: boolean; is_published: boolean;
};
const EMPTY: Draft = {
  slug: "", title: "", summary: "", body: "", series: "", format: "online", location: "", start: "", end: "",
  timezone: "Africa/Accra", all_day: false, date_label: "", partners: "", registration_url: "", recording_url: "",
  is_featured: false, is_published: true,
};

export function EventsManager() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [imageTarget, setImageTarget] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      setEvents(await apiClient.get<AdminEvent[]>("/admin/events"));
    } catch (e) {
      setNotice({ kind: "error", text: e instanceof Error ? e.message : "Could not load events." });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  function publish() {
    refreshPublicPages("events");
  }
  function flash(kind: "ok" | "error", text: string) {
    if (kind === "ok") publish();
    setNotice({ kind, text });
    if (kind === "ok") window.setTimeout(() => setNotice(null), 4000);
  }

  function edit(e: AdminEvent) {
    setSlugTouched(true);
    setDraft({
      id: e.id, slug: e.slug, title: e.title, summary: e.summary, body: e.body ?? "", series: e.series ?? "", format: e.format,
      location: e.location ?? "", start: utcToLocal(e.start_at, e.timezone), end: utcToLocal(e.end_at, e.timezone),
      timezone: e.timezone, all_day: e.all_day, date_label: e.date_label ?? "", partners: e.partners ?? "",
      registration_url: e.registration_url ?? "", recording_url: e.recording_url ?? "", is_featured: e.is_featured,
      is_published: e.is_published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(ev: React.FormEvent) {
    ev.preventDefault();
    if (!draft) return;
    const start = draft.all_day && draft.start ? `${draft.start.slice(0, 10)}T00:00` : draft.start;
    const end = draft.all_day && draft.end ? `${draft.end.slice(0, 10)}T23:59` : draft.end;
    const body = {
      slug: draft.slug, title: draft.title, summary: draft.summary, body: draft.body || null, series: draft.series || null,
      format: draft.format, location: draft.location || null, start_at: localToUtcIso(start, draft.timezone),
      end_at: localToUtcIso(end, draft.timezone), timezone: draft.timezone, all_day: draft.all_day,
      date_label: draft.date_label || null, partners: draft.partners || null, registration_url: draft.registration_url || null,
      recording_url: draft.recording_url || null, is_featured: draft.is_featured, is_published: draft.is_published,
    };
    setBusy("save");
    try {
      if (draft.id) {
        const u = await apiClient.patch<AdminEvent>(`/admin/events/${draft.id}`, body);
        setEvents((l) => l.map((x) => (x.id === u.id ? u : x)));
        flash("ok", `"${u.title}" updated.`);
      } else {
        const c = await apiClient.post<AdminEvent>("/admin/events", body);
        setEvents((l) => [c, ...l]);
        flash("ok", `"${c.title}" added. You can upload a flyer or photo next.`);
      }
      setDraft(null);
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Could not save the event.");
    } finally {
      setBusy(null);
    }
  }

  async function toggle(e: AdminEvent) {
    setBusy(e.id);
    try {
      const u = await apiClient.patch<AdminEvent>(`/admin/events/${e.id}`, { is_published: !e.is_published });
      setEvents((l) => l.map((x) => (x.id === u.id ? u : x)));
      flash("ok", u.is_published ? `"${u.title}" is now public.` : `"${u.title}" is hidden.`);
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Update failed.");
    } finally {
      setBusy(null);
    }
  }

  async function remove(e: AdminEvent) {
    if (!window.confirm(`Delete "${e.title}"? This cannot be undone. Hiding it keeps the record instead.`)) return;
    setBusy(e.id);
    try {
      await apiClient.delete(`/admin/events/${e.id}`);
      setEvents((l) => l.filter((x) => x.id !== e.id));
      flash("ok", `"${e.title}" deleted.`);
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Could not delete.");
    } finally {
      setBusy(null);
    }
  }

  async function onFile(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file || !imageTarget) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return flash("error", "Please choose a JPG, PNG or WebP image.");
    if (file.size > MAX_MB * 1024 * 1024) return flash("error", `That image is larger than ${MAX_MB}MB. Please resize it first.`);
    setBusy(imageTarget);
    try {
      const u = await apiClient.upload<AdminEvent>(`/admin/events/${imageTarget}/image`, file);
      setEvents((l) => l.map((x) => (x.id === u.id ? u : x)));
      flash("ok", `Image saved for "${u.title}".`);
    } catch (err) {
      flash("error", err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(null);
      setImageTarget(null);
    }
  }

  const field = "w-full border border-slate-300 bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none";
  const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setDraft((d) => (d ? { ...d, [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value } : d));

  return (
    <section className="space-y-6" aria-labelledby="events-admin-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="events-admin-title" className="font-display text-2xl text-ink">Events</h2>
          <p className="mt-1 text-sm text-slate-600">
            Events move from Upcoming to Past automatically once they end. Hidden events are drafts only you can see.
          </p>
        </div>
        <button type="button" className="btn-primary !py-2.5" onClick={() => { setSlugTouched(false); setDraft({ ...EMPTY }); }}>
          Add an event
        </button>
      </div>

      {notice && (
        <p role={notice.kind === "error" ? "alert" : "status"} className={`border px-4 py-3 text-sm ${notice.kind === "error" ? "border-red-200 bg-red-50 text-danger" : "border-emerald-200 bg-emerald-50 text-success"}`}>
          {notice.text}
        </p>
      )}

      <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={onFile} aria-hidden="true" tabIndex={-1} />

      {draft && (
        <form onSubmit={save} className="grid gap-4 border border-slate-200 bg-white p-6 sm:grid-cols-2">
          <h3 className="font-sans text-base font-semibold text-ink sm:col-span-2">{draft.id ? `Edit "${draft.title}"` : "Add an event"}</h3>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Title *</span>
            <input required minLength={3} maxLength={200} className={field} value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: slugTouched ? draft.slug : slugify(e.target.value) })} />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Web address *</span>
            <span className="flex items-center gap-1 text-slate-500">
              /events/
              <input required pattern="[a-z0-9]+(-[a-z0-9]+)*" className={field} value={draft.slug}
                onChange={(e) => { setSlugTouched(true); setDraft({ ...draft, slug: slugify(e.target.value) }); }} />
            </span>
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Short summary * <span className="font-normal text-slate-500">(one or two sentences, shown in lists)</span></span>
            <textarea required minLength={10} maxLength={600} rows={2} className={field} value={draft.summary} onChange={set("summary")} />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Full description <span className="font-normal text-slate-500">(leave a blank line between paragraphs)</span></span>
            <textarea maxLength={20000} rows={5} className={field} value={draft.body} onChange={set("body")} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Format *</span>
            <select className={field} value={draft.format} onChange={set("format")}>
              {Object.entries(FORMAT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Series</span>
            <input list="series-options" maxLength={120} className={field} value={draft.series} onChange={set("series")} />
            <datalist id="series-options">
              {Array.from(new Set(events.map((e) => e.series).filter(Boolean))).map((s) => <option key={s as string} value={s as string} />)}
            </datalist>
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Location</span>
            <input maxLength={200} placeholder="e.g. Online (Zoom), or venue and city" className={field} value={draft.location} onChange={set("location")} />
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={draft.all_day} onChange={set("all_day")} />
            Whole day event (no specific times)
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Starts</span>
            <input type={draft.all_day ? "date" : "datetime-local"} className={field}
              value={draft.all_day ? draft.start.slice(0, 10) : draft.start} onChange={set("start")} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Ends</span>
            <input type={draft.all_day ? "date" : "datetime-local"} className={field}
              value={draft.all_day ? draft.end.slice(0, 10) : draft.end} onChange={set("end")} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Time zone</span>
            <select className={field} value={draft.timezone} onChange={set("timezone")}>
              {TIMEZONES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Or a date label <span className="font-normal text-slate-500">(if exact dates are not set)</span></span>
            <input maxLength={80} placeholder="e.g. November 2026" className={field} value={draft.date_label} onChange={set("date_label")} />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block font-medium">Partners</span>
            <input maxLength={300} placeholder="e.g. Tarragon Edge" className={field} value={draft.partners} onChange={set("partners")} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Registration link</span>
            <input type="url" pattern="https://.*" placeholder="https://" className={field} value={draft.registration_url} onChange={set("registration_url")} />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">Recording link <span className="font-normal text-slate-500">(after the event)</span></span>
            <input type="url" pattern="https://.*" placeholder="https://" className={field} value={draft.recording_url} onChange={set("recording_url")} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.is_featured} onChange={set("is_featured")} />
            Feature at the top of the Events page
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.is_published} onChange={set("is_published")} />
            Show on the website
          </label>
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={busy === "save"} className="btn-dark !py-2.5 disabled:opacity-50">{busy === "save" ? "Saving..." : "Save event"}</button>
            <button type="button" className="btn-secondary !py-2.5" onClick={() => setDraft(null)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading events...</p>
      ) : (
        <ul className="divide-y divide-slate-200 border border-slate-200 bg-white">
          {events.map((e) => (
            <li key={e.id} className={`flex flex-wrap items-center gap-4 p-4 ${e.is_published ? "" : "bg-slate-50"}`}>
              <div className="h-16 w-16 shrink-0 overflow-hidden bg-stone">
                {e.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.image_url} alt="" className="h-full w-full object-cover object-top" />
                ) : (
                  <span className="flex h-full items-center justify-center text-[11px] text-slate-400">No image</span>
                )}
              </div>
              <div className="min-w-[14rem] flex-1">
                <p className="font-medium text-ink">
                  {e.title}
                  {e.is_featured && <span className="ml-2 text-xs uppercase tracking-wide text-accent">Featured</span>}
                  {!e.is_published && <span className="ml-2 text-xs text-slate-500">(draft, hidden)</span>}
                </p>
                <p className="text-sm text-slate-600">
                  {dateLine(e)} · {FORMAT_LABEL[e.format] ?? e.format} · {isPast(e) ? "Past" : "Upcoming"}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button type="button" onClick={() => edit(e)} className="border border-slate-300 px-3 py-1.5 hover:border-ink">Edit</button>
                <button type="button" disabled={busy === e.id} onClick={() => { setImageTarget(e.id); fileInput.current?.click(); }} className="border border-slate-300 px-3 py-1.5 hover:border-ink">
                  {busy === e.id && imageTarget === e.id ? "Uploading..." : e.image_url ? "Change image" : "Upload image"}
                </button>
                <button type="button" disabled={busy === e.id} onClick={() => toggle(e)} className="border border-slate-300 px-3 py-1.5 hover:border-ink">
                  {e.is_published ? "Hide" : "Publish"}
                </button>
                <a href={`/events/${e.slug}`} target="_blank" rel="noreferrer" className="border border-slate-300 px-3 py-1.5 hover:border-ink">View</a>
                <button type="button" onClick={() => remove(e)} className="border border-red-200 px-3 py-1.5 text-danger hover:bg-red-50">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
