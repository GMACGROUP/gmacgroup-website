# Going live on gmac-group.com

This is the checklist for moving the redesigned site (branch `redesign/corporate-advisory`) into production and pointing gmac-group.com at it instead of Wix. Work through it in order. Each step says who usually does it and how to check it worked.

Allow about two hours, plus up to a day for DNS to settle.

---

## 0. Before you start

- [ ] Someone with **owner access** to each of these is available: GitHub (GMACGROUP), Vercel, Render, Supabase, and the domain registrar for gmac-group.com.
- [ ] Back up the Supabase database: Supabase dashboard, Database, Backups (or `pg_dump`).
- [ ] Decide which programmes and opportunities are real (see step 6). Everything already in the catalogue starts hidden.

---

## 1. Remove the exposed applicant files from Git history (do this first)

Applicant documents, including an identity document and CVs, were committed to the repository in the past. They have been deleted from the current code, but **they are still in the Git history**, so anyone who can see the repository can still download them.

1. If the repository is public, make it private now: GitHub, Settings, General, Danger Zone, Change visibility.
2. One person with admin rights rewrites history (everyone else should stop pushing until this is done):

   ```bash
   pip install git-filter-repo
   git clone --mirror https://github.com/GMACGROUP/gmacgroup-website.git
   cd gmacgroup-website.git
   git filter-repo --invert-paths --path uploads/ --path backend/uploads/ --force
   git push --force --mirror
   ```

3. Everyone with a local copy deletes it and clones again.
4. Ask GitHub Support to purge cached views of the old commits (support.github.com, "Remove sensitive data").
5. Tell the affected applicants that their documents were exposed, as Ghana's Data Protection Act 2012 (Act 843) and the Nigeria Data Protection Act 2023 expect. Take advice on whether a regulator must be notified.

**Check:** on github.com, search the repository for `National_Identifaction`; there should be no results.

---

## 2. Supabase (database and storage)

### 2a. Run the new migrations

In Supabase, SQL Editor, run these files from `database/migrations/` **in order**, one at a time. Each is safe to run twice.

| File | What it does |
|---|---|
| `0010_team_members.sql` | Team table and the current roster |
| `0011_events.sql` | Events table, past and upcoming events |
| `0012_contact_details.sql` | Organisation and topic on contact messages |
| `0013_catalogue.sql` | Programmes, opportunities and publications, existing items as drafts |
| `0014_enable_rls_everywhere.sql` | Row level security on every table |

**Check:** run
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND NOT rowsecurity;
```
It should return no rows.

### 2b. Storage buckets

- [ ] **`resumes`** (CVs and application documents) must be **private**. Storage, `resumes`, bucket settings, turn "Public bucket" **off**. Admins open CVs through links that expire after five minutes.
- [ ] **`media`** (team photos and event images uploaded in the admin) must exist and be **public**. Create it if it does not exist.

**Check:** paste an old CV link (one containing `/object/public/resumes/`) into a private browser window. It should fail to load.

### 2c. Check who has admin access

```sql
SELECT email, role, created_at FROM users WHERE role = 'admin';
```
Every row should be someone you recognise. Change anyone else to `member`.

---

## 3. Render (the API)

Render dashboard, `gmacgroup-backend`, Environment. Set or confirm:

| Variable | Value |
|---|---|
| `ENVIRONMENT` | `production` |
| `ALLOWED_ORIGINS` | `["https://gmac-group.com","https://www.gmac-group.com","https://gmacgroup.vercel.app"]` |
| `FRONTEND_URL` | `https://gmac-group.com` |
| `PUBLIC_API_URL` | the API's own address, for example `https://gmacgroup-backend.onrender.com` |
| `STORAGE_PROVIDER` | `supabase` |
| `STORAGE_BUCKET` | `resumes` |
| `MEDIA_BUCKET` | `media` |
| `OPERATIONS_EMAIL` | `info@gmac-group.com` (where contact messages and applications are sent) |
| `EMAIL_FROM` | an address on gmac-group.com once the domain is verified with your email provider |
| `JWT_SECRET` | already generated; leave it unless it is shorter than 32 characters |

Then **Manual Deploy, Deploy latest commit**.

**Check:** open `https://<your-api>/health`. It should say `healthy`. Then open `/api/v1/programmes/`. It should return `[]` until you publish something.

> **Free plan note.** Render's free plan puts the API to sleep after 15 minutes without traffic, and the first request then takes 30 to 60 seconds. The website has fallbacks for the team and events pages, but forms will feel broken to the first visitor after a quiet spell. For a live company site, move the API to a paid instance (Starter is enough).

---

## 4. Vercel (the website)

Vercel, the project, Settings, Environment Variables (Production):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://<your-api>/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | `https://gmac-group.com` |

Then:

- [ ] Analytics tab: **Enable** Web Analytics.
- [ ] Settings, Git: Production Branch stays `main`.

---

## 5. Merge and deploy

1. On GitHub, open a pull request from `redesign/corporate-advisory` into `main`.
2. Review the preview deployment Vercel attaches to it: click through Home, Expertise, Research, Programmes, Events, About, Team, Careers, Contact, Privacy and Terms.
3. Merge. Vercel deploys `main` automatically, and Render redeploys the API.

**Check:** the production deployment in Vercel shows "Ready".

---

## 6. Content to settle before announcing

Sign in at `/login` with an admin account and open `/admin`.

- **Catalogue (Programmes and Opportunities).** Every existing item is a **Draft** and invisible to the public. These were placeholders in the old site. For each one, edit it so the title, dates and description are true, then press **Publish**, or delete it.
  - Several opportunities charged applicants a fee (VIP and Premium tiers) to apply for a fellowship or internship. Applicants widely read a fee to apply for work as a sign of a recruitment scam, and some countries restrict it; take advice before keeping it. We recommend removing paid tiers from opportunities and keeping fees only on training programmes.
- **Events.** Check the 2026 summit's registration link and venue. Publish the draft events when their details are final.
- **Team.** Add the three missing headshots (Benjamin Asiedu, Ramadhani Athumani Mbiaji, Edwin Camichael Ngyfo Teno).
- **Legal pages.** Have a lawyer review `/privacy` and `/terms`, including the governing law (currently Nigeria) and the company details.

---

## 7. Point gmac-group.com at the new site

1. Vercel, Settings, Domains: add `gmac-group.com` and `www.gmac-group.com`. Vercel shows the exact DNS records to create.
2. At the domain registrar (or in Wix if Wix manages the DNS), **remove the Wix records** for the root and `www`, and add the records Vercel gave you. Typically:
   - `A` record, host `@`, value `76.76.21.21`
   - `CNAME` record, host `www`, value `cname.vercel-dns.com`
3. **Do not touch the MX records.** They deliver email to info@gmac-group.com.
4. In Vercel, set `gmac-group.com` as the primary domain and redirect `www` to it.
5. Once the new site is live, cancel the Wix website plan, but keep the domain and email if they are billed through Wix.

**Check (after DNS updates, usually within an hour, up to 48):**
- `https://gmac-group.com` shows the new site with a padlock.
- `https://www.gmac-group.com` redirects to `https://gmac-group.com`.
- Send yourself a test email to info@gmac-group.com. It should arrive.

---

## 8. After launch

- [ ] Google Search Console: add the domain, then submit `https://gmac-group.com/sitemap.xml`.
- [ ] Send a real message through `/contact` and confirm it reaches `OPERATIONS_EMAIL`.
- [ ] Apply to a published opportunity with a test CV, then open it from the admin. The CV should open, and the link should stop working after five minutes.
- [ ] Share a page on LinkedIn and check the preview image and title.
- [ ] Update the website link on LinkedIn, Instagram, X and Facebook.

---

## What was tested before handover

- 35 backend tests pass (team, events, catalogue, publishing, private CV links, contact form validation, honeypot and rate limits).
- Production build succeeds.
- A crawl of every internal link found no broken links. Old addresses (`/services`, `/insights`, `/opportunities`) redirect to their new pages, and unknown pages return a proper 404.
- No page scrolls sideways on a 375 pixel wide phone.
- An automated WCAG 2 AA accessibility scan (axe) passes on all main pages.

## Known limits

- The form rate limits are kept in the API's memory. That is fine for one API instance; if you ever run several, move them to a shared store.
- Next.js is on the latest 14.2 release. Some advisories are only fixed in version 15 and later; plan that upgrade as a separate piece of work.
- The AI assistant widget (bottom right) calls a separate service at `gmac-group-assistant.onrender.com`. It is unchanged by this redesign; review what it says about the company before launch.
