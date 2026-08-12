# ODEH & PARTNERS — Website & CMS

Full-stack public website and admin CMS for **ODEH & PARTNERS** (engineering and consulting). This repository is the authoritative source for the public site, Laravel API, content seed data, and project media used by the 2026 website.

## Overview

The repository contains:

- Public ODEH marketing website (React SPA)
- Admin CMS / dashboard (`/admin/*`)
- Laravel 12 backend REST API
- MySQL-backed content architecture (migrations + seeders)
- Project and website media under `public/assets/`
- Deployment documentation under `docs/deployments/`

`master` is the authoritative branch for this project.

## Tech Stack

| Layer | Technology | Version (from lock/manifests) |
|-------|------------|-------------------------------|
| Frontend | React | `^18.3.1` |
| Frontend | React Router | `^6.28.0` |
| Frontend | Vite | `^5.4.11` |
| Frontend | TypeScript | `^5.7.3` |
| Frontend | Vitest | `^3.2.4` |
| Frontend | Lenis | `^1.3.25` |
| Backend | PHP | `^8.2` |
| Backend | Laravel | `^12.0` |
| Backend | Laravel Sanctum | `^4.3` |
| Database | MySQL / MariaDB | local/server configured via `.env` |

## Repository Structure

```text
/
├── src/                         # React SPA (public site + admin CMS)
│   ├── api/                     # API client / typed fetch layer
│   ├── components/              # Public UI components
│   ├── pages/                   # Public route pages
│   ├── data/                    # Static fallbacks where used
│   ├── modules/admin/           # Admin CMS modules & routes
│   └── utils/                   # Shared frontend utilities
├── public/                      # Static website assets (served by Vite)
│   └── assets/                  # About, careers, projects, services media
├── backend/                     # Laravel 12 API application
│   ├── app/                     # Controllers, models, enums, concerns
│   ├── database/migrations/     # Schema
│   ├── database/seeders/        # Seeders + content data
│   ├── routes/api.php           # Public + admin API routes
│   ├── storage/                 # Local runtime storage (not committed)
│   └── tests/                   # PHPUnit / Artisan tests
├── scripts/                     # Asset pipeline & maintenance utilities
├── docs/                        # Audits and deployment reports
│   └── deployments/             # Environment deployment notes
├── package.json                 # Frontend tooling
└── vite.config.js               # Vite configuration
```

`dist/` is production frontend build output (generated, not source of truth).

## Main Features

Verified modules present in the current codebase:

**Public website**

- Home, About (overview / approach / history / team / activities)
- Projects (listing, category, detail)
- Services (routed; content via API)
- Careers / job detail / applications
- Connect, Reach Out, Search
- Legal pages (privacy, terms)
- SEO metadata consumption

**Admin CMS**

- Dashboard
- Projects & Project Categories
- Services, Activities
- Team categories, ranks, members
- Careers (jobs) & Applications
- Contact Messages
- Home Page, About Pages, Connect Page
- Navigation & Footer
- Legal Pages, SEO
- Website Settings
- Users, Roles & Permissions

## Public Website Routes

Representative React Router paths from `src/App.jsx`:

| Path | Purpose |
|------|---------|
| `/` | Home |
| `/about/overview`, `/about/approach`, `/about/history` | About sections |
| `/about/team-members` | Team |
| `/about/activities`, `/about/activities/:slug` | Activities |
| `/projects`, `/projects/:category`, `/projects/:category/:project` | Projects |
| `/careers`, `/careers/:slug`, `/careers/:slug/apply` | Careers |
| `/connect`, `/reach-out`, `/search` | Connect / forms / search |
| `/privacy-policy`, `/terms-and-conditions` | Legal |
| `/admin/*` | Admin CMS |

## API Architecture

Laravel routes are defined in `backend/routes/api.php` and served under `/api`.

```text
/api/public/...     # Public content + form submissions (no admin auth)
/api/auth/...       # Login / logout / current user (Sanctum)
/api/admin/...      # CMS CRUD & settings (auth:sanctum + permissions)
```

**Auth model:** Laravel Sanctum bearer tokens for admin sessions. Public endpoints are open for published content and selected POST forms (contact, job applications). Admin routes require authentication and module permissions enforced by the backend.

## Local Development Setup

### Prerequisites

- Node.js 18+
- PHP 8.2+
- Composer 2.x
- MySQL 8+ (or compatible MariaDB), e.g. via XAMPP

### 1. Database

Create a local database (name is configurable in `backend/.env`):

```sql
CREATE DATABASE odeh_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configure DB_* (and related) values in backend/.env — do not commit this file
php artisan storage:link
php artisan migrate:fresh --seed
php artisan serve
```

API default local URL: `http://127.0.0.1:8000/api`

### 3. Frontend

From the repository root:

```bash
cp .env.example .env
# Set VITE_API_BASE_URL to your local API, e.g. http://127.0.0.1:8000/api
npm install
npm run dev
```

| URL | Description |
|-----|-------------|
| `http://localhost:5173/` | Public website |
| `http://localhost:5173/admin/login` | Admin login |

Default local admin credentials are created by the backend database seeders. Check `backend/database/seeders/` for the seeded account used in local development. Change or remove seed credentials before production use.

## Database

- Schema lives in `backend/database/migrations/`
- Seeders and structured content live in `backend/database/seeders/` (including `data/` PHP content files)
- Local DB host, database name, username, and password are configured only in `backend/.env` (never committed)

Typical reset for local rebuild:

```bash
cd backend
php artisan migrate:fresh --seed
```

## Media / Assets

- Website and project imagery: `public/assets/` (including `public/assets/projects/`)
- Uploaded CMS media and CVs use Laravel storage under `backend/storage/` (local runtime; not committed)
- Public upload access expects the storage symlink:

```bash
cd backend
php artisan storage:link
```

This links `backend/public/storage` → `backend/storage/app/public`.

## Build

```bash
npm run lint      # TypeScript check (tsc --noEmit)
npm run build     # Production frontend build → dist/
npm run preview   # Preview production build
npm run test      # Vitest unit tests
```

## Testing

```bash
# Frontend
npm run test
npm run lint

# Backend
cd backend
php artisan test
```

## Deployment

Deployment procedures and environment-specific notes are documented under:

[`docs/deployments/`](docs/deployments/)

Do not put SSH credentials, passwords, API tokens, or private keys into documentation or Git.

High-level production expectations:

1. Build the frontend with the correct `VITE_API_BASE_URL`
2. Serve `dist/` as an SPA (fallback to `index.html`)
3. Deploy `backend/` with `APP_ENV=production`, `APP_DEBUG=false`
4. Run migrations, cache config/routes as appropriate, configure CORS, and keep uploads/CVs private

## Git Workflow

- **`master` is the authoritative branch.**
- Create feature branches from `master`.
- Merge back to `master` after validation (tests/build/review).
- Do not commit `.env`, backups, SQL dumps, private keys, or local import artifacts.

Historical development branches (`backend-api-foundation`, `frontend-admin-complete`) remain for reference until confirmed fully superseded by `master`.

## Security

- `.env` / `backend/.env` are not committed
- Credentials, tokens, private keys, and auth files must never be committed
- `backups/`, SQL dumps, and temporary import reports stay local or server-side only
- `backend/vendor/` and `node_modules/` are excluded from Git

## Project Status

As of the repository consolidation onto `master`:

- Full-stack public website + admin CMS is present and integrated with the Laravel API
- Content seeders, migrations, and project assets are part of the tracked application
- DEV deployment documentation exists under `docs/deployments/`
- Treat production readiness as environment-specific: configure secrets, CORS, storage, and hosting per deployment docs — do not assume a given host is live from this README alone
