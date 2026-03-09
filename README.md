# LocalSiteAI

Local business website generator: form → AI (Gemini) → template → preview → publish.

**Stack:** Next.js 14, Supabase, Gemini 2.0 Flash, TypeScript, Tailwind.

## Setup (all on E drive)

1. **Environment**  
   Copy `.env.local.example` to `.env.local` and set:
   - Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - Gemini: `GEMINI_API_KEY`

2. **Database & storage**  
   See **E:\\localsite ai\\SETUP_DATABASE.md** for:
   - SQL to create `sites` and `uploads` tables
   - Storage bucket `business-photos` (public, 5 MB, images only)

3. **Run**
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:3000 → “Build My Website” to test.

## Project layout

- `app/` — Landing, preview, public site, API routes (upload, generate, publish)
- `components/` — Landing, form wizard (7 steps), preview bar, UI
- `templates/` — Types, registry, placeholder template (real templates added later)
- `lib/` — Supabase client/server, slugify, Gemini extract & template selection

Nothing is written or installed on C drive; the app and any downloads stay on **E:\\localsite ai**.
