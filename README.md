# Job Easy Platform

A Hostinger-friendly modular monolith: **React (Vite) + Node.js/Express + MySQL (Prisma)**.

## Structure
- `frontend/` — React app (public site + user dashboard + admin dashboard in one build)
- `backend/` — Express modular monolith, one folder per domain module under `src/modules`
- `database/schema.sql` — complete MySQL schema, source of truth for all tables
- `docs/` — architecture reference

## Getting started

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env      # fill in DATABASE_URL, JWT secrets
npm install
npx prisma db pull        # introspect schema.sql tables into prisma/schema.prisma
npx prisma generate
npm run dev                # http://localhost:5000/api/v1
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

## Site settings (admin console → Settings)
- `database/schema.sql` — `site_settings` table (singleton row, id = 1), seeded with the
  same defaults shown in `demo.html`.
- `backend/src/modules/site-settings/` — `GET /api/v1/settings/public` (no auth, powers
  header/footer/hero/theme on the public site), `GET`/`PUT /api/v1/settings/admin`
  (SUPER_ADMIN / CONTENT_ADMIN only). Every `PUT` writes an `audit_logs` row.
- `frontend/src/pages/admin/Settings.jsx` — the real React version of the Settings
  screen from `demo.html`, with the same 5 tabs (`frontend/src/modules/settings/`).
  The Theme tab is wired to `context/ThemeContext.jsx`, which sets `--theme-accent` /
  `--theme-base` CSS variables on `:root` — `PublicLayout` and `AdminLayout` already
  consume them, so picking a color updates the header/sidebar/buttons live, the same
  way the color picker in `demo.html` does.
- Offers & promotions intentionally has no new table — it reuses `coupons` / `discounts`
  from `schema.sql`. The tab is read-only for now; wire it up once a `/pricing`
  coupon-CRUD screen exists.

## Notes
- Every backend module follows the same 5-file pattern: `routes → controller → service → repository → validation`.
  See `backend/src/modules/auth` for a fully wired example (register/login/refresh);
  every other module is scaffolded with the same shape and `TODO` markers where real
  Prisma calls and field-specific validation need to be filled in.
- `routes/index.js` is the single map of the public API surface.
- Central cross-cutting systems (approvals, pricing, wallet) are their own modules —
  other modules should call into them rather than duplicating logic.
- No Docker, Redis, or microservices in this version — everything runs as one
  Node process + one MySQL database, per the Hostinger-friendly decision.
