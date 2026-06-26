# MHAP Aluminum and Multitech Nigeria Limited — Website

A full-stack corporate website with a public marketing site and a secured
admin dashboard, built on **PostgreSQL**.

- **Frontend:** React + Vite + Tailwind CSS + Framer Motion + React Router
- **Backend:** Node.js + Express + PostgreSQL (via `pg`)
- **Auth:** JWT, bcrypt-hashed passwords
- **File uploads:** Multer (project photos, gallery images, logo/hero/banner, quote drawings)

```
mhap-aluminum/
├── backend/      Express API + PostgreSQL schema
├── frontend/     React (Vite) public site + admin dashboard
└── docker-compose.yml   optional local Postgres for development
```

---

## 1. Prerequisites

- Node.js 18+
- A PostgreSQL 13+ database — any of these work:
  - Local install ([postgresql.org/download](https://www.postgresql.org/download/))
  - The included `docker-compose.yml` (`docker compose up -d`)
  - A managed provider: Render, Railway, Supabase, Neon, AWS RDS, etc.

## 2. Set up the database

```bash
# Option A — local Docker Postgres (fastest way to try this out)
docker compose up -d

# Option B — use your own Postgres: just make sure a database + user exist
```

Copy the backend environment file and fill in your connection details:

```bash
cd backend
cp .env.example .env
```

If you used `docker-compose.yml` as-is, `.env.example`'s defaults already match it.
For a managed Postgres provider, paste their connection string into
`DATABASE_URL` and set `PGSSL=true`.

## 3. Install and initialize the backend

```bash
cd backend
npm install
npm run db:init       # creates all tables (schema.sql), loads sample
                       # content (seed.sql), and creates your first admin user
npm run dev            # starts the API on http://localhost:5000
```

`npm run db:init` prints the admin email/password it just created
(from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env`) — **log in and
change this password immediately** via the admin dashboard.

Re-running `npm run db:init` is safe: the schema uses `IF NOT EXISTS`,
the seed data uses `ON CONFLICT DO NOTHING`, and the admin user is only
created if `admin_users` is empty. Use `node db/init.js --no-seed` if you
want the schema only, without the sample services/projects/testimonials.

## 4. Install and run the frontend

```bash
cd frontend
npm install
cp .env.example .env   # defaults are fine for local dev
npm run dev             # starts the site on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to `http://localhost:5000`,
so the two apps talk to each other automatically — no CORS setup needed
for local development.

Visit:
- **Public site:** http://localhost:5173
- **Admin dashboard:** http://localhost:5173/admin/login

---

## Design system

The visual direction is meant to read as a precision-engineering /
fabrication shop, not a generic SaaS template:

- **Palette:** deep navy (`#0B1F3A`), aluminum/steel gray (`#8B9299`),
  silver (`#C8CDD3`), white, with an electric blue accent (`#2D6CDF`) for
  calls to action. Defined as Tailwind tokens in `frontend/tailwind.config.js`.
- **Typography:** Space Grotesk for headings (geometric, architectural),
  Inter for body copy, and IBM Plex Mono for labels/specs/metadata — the
  mono face is used the way a fabrication shop's spec sheet would.
- **Signature motif:** an aluminum extrusion cross-section line drawing
  (`frontend/src/components/ui/ExtrusionDivider.jsx`) used as a section
  divider throughout the site, echoing an actual window-frame cut profile
  instead of a generic gradient line.
- **Blueprint grid background** (`.blueprint-bg` in `index.css`) on dark
  sections, reinforcing the engineering/technical-drawing feel.

## What's editable from the admin dashboard

Logged-in admins (`/admin`) can manage:

- Company name, slogan, logo, about/mission/vision/core values
- Homepage hero heading/subheading/background image, homepage banner
- Stats counters (projects completed, happy clients, years of experience, team size)
- Phone, WhatsApp, email, address, Google Maps embed URL, social links
- Brand colors (stored for reference / custom theming)
- Services (create/edit/delete, icon, descriptions, ordering, visibility)
- Projects (create/edit/delete, category, client, location, date, description,
  publish/feature flags) plus a per-project photo gallery (upload/delete)
- General gallery images (independent of a specific project)
- Testimonials (create/edit/delete, rating, ordering, visibility)
- Quote requests (view, filter by status, update status, delete)
- Contact messages (view, mark read, delete)
- Their own admin password

## Database schema

See `backend/db/schema.sql` for the full PostgreSQL schema. Tables:
`admin_users`, `company_profile`, `services`, `projects`, `project_images`,
`gallery_images`, `testimonials`, `quote_requests`, `contact_messages`,
`website_settings`. All admin-facing mutations go through parameterized
queries (`pg`'s `$1, $2, ...` placeholders) — never raw string concatenation —
to prevent SQL injection.

## Security implemented

- bcrypt password hashing (cost factor 12)
- JWT-based admin authentication (`Authorization: Bearer <token>`)
- Helmet security headers, configured CORS (only your frontend origin)
- express-validator input validation on every write endpoint
- express-rate-limit on login, contact form, and quote form (brute-force /
  spam protection) plus a global API rate limit
- Multer file-type allowlist (JPG/PNG/WEBP/GIF/PDF only) and size limit
  (`MAX_UPLOAD_MB`, default 8MB), with randomly generated filenames
- Centralized error handler that never leaks stack traces in production

## Going to production

1. **Database:** point `DATABASE_URL` at your production Postgres (set
   `PGSSL=true` for most managed providers), then run `npm run db:init`
   once against it.
2. **Backend:** deploy `backend/` (Render, Railway, a VPS with PM2/systemd,
   etc). Set `NODE_ENV=production`, a strong random `JWT_SECRET`, and
   `CLIENT_URL` to your real frontend domain(s).
3. **Frontend:** `npm run build` in `frontend/` produces a static `dist/`
   folder — deploy it to Vercel, Netlify, Cloudflare Pages, or serve it via
   Nginx/Express. Set `VITE_API_URL` to your backend's public URL before
   building (or serve frontend and backend from the same domain behind a
   reverse proxy and keep it as `/api`).
4. **Uploaded files:** `backend/uploads/` is local disk storage. For most
   hosting platforms (which use ephemeral filesystems) you'll want either
   a persistent volume or to swap the Multer disk storage for an
   object-storage backend (e.g. S3-compatible). The storage logic is
   isolated in `backend/src/middleware/upload.js` if you want to do this.
5. Update `frontend/public/sitemap.xml` and `robots.txt` with your real domain.

## Notes

- Sample/placeholder content (3 example projects, 16 services matching the
  brief, 3 testimonials) is loaded by `db/seed.sql` so the site isn't empty
  on first run — replace it via the admin dashboard.
- Service icons reference [lucide-react](https://lucide.dev) icon names in
  kebab-case (e.g. `door-open`); unknown names fall back to a generic icon
  rather than breaking the page.
