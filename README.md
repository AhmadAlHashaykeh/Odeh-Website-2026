# ODEH & PARTNERS Website & CMS

Full-stack website and admin CMS for ODEH & PARTNERS — engineering and consulting.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)
![Status](https://img.shields.io/badge/Release_Candidate-success)

## Project Structure

```
Odeh-Website-Frontend/
├── src/                  # React SPA (public website + admin CMS)
│   ├── api/              # TypeScript API client layer
│   ├── components/       # Public UI components
│   ├── pages/            # Public route pages
│   ├── data/             # Static public content fallbacks
│   └── modules/admin/    # Admin CMS modules
├── backend/              # Laravel 12 REST API
├── public/               # Static assets
├── scripts/              # Asset pipeline utilities
└── dist/                 # Production build output
```

## Frontend

React 18 SPA built with Vite. Serves both the public website and the admin CMS (`/admin/*`).

| Area | Path | Description |
|------|------|-------------|
| Public site | `/`, `/projects`, `/about/*`, `/careers`, `/connect` | Marketing website |
| Admin CMS | `/admin/dashboard`, `/admin/projects`, … | Content management |
| API client | `src/api/` | Typed fetch wrapper with Sanctum auth |

### Admin Modules

Dashboard, Projects, Project Categories, Services, Activities, Team Members, Careers, Applications, Contact Messages, Home Page, About Pages, Navigation & Footer, Connect Page, Legal Pages, SEO, Website Settings, Users & Roles.

## Backend

Laravel 12 API with Sanctum authentication, role-based permissions, and CRUD endpoints for all CMS modules. See [backend/README.md](backend/README.md) for full API documentation.

## Local Setup

### Prerequisites

- Node.js 18+
- PHP 8.2+
- Composer 2.x
- MySQL 8+ (XAMPP, WAMP, or standalone)

### 1. MySQL Database

Create the database before starting the backend:

```sql
CREATE DATABASE odeh_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan storage:link
php artisan migrate:fresh --seed
php artisan serve
```

Default `.env` database settings:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=odeh_cms
DB_USERNAME=root
DB_PASSWORD=
```

API runs at `http://127.0.0.1:8000/api`.

### 3. Frontend

```bash
# From repository root
cp .env.example .env
npm install
npm run dev
```

Required frontend `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

| URL | Description |
|-----|-------------|
| `http://localhost:5173/` | Public website |
| `http://localhost:5173/admin/login` | Admin login |
| `http://localhost:5173/admin/dashboard` | Admin dashboard |

### Development Admin (local only)

| Field | Value |
|-------|-------|
| Email | `admin@odeh.local` |
| Password | `OdehLocalDev2026!` |

**Development only — change or remove this account before production.**

## Build

```bash
npm run lint      # TypeScript check
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

## Production Deployment

### Frontend

1. Set `VITE_API_BASE_URL` to the production API URL
2. Run `npm run build`
3. Serve `dist/` via CDN or static web server (Nginx, Apache, S3+CloudFront)
4. Configure SPA fallback to `index.html` for client-side routing

### Backend

1. Deploy `backend/` to a PHP host
2. Set `APP_ENV=production`, `APP_DEBUG=false`
3. Run migrations: `php artisan migrate --force`
4. Cache config/routes: `php artisan config:cache && php artisan route:cache`
5. Configure CORS for the frontend domain
6. Use private storage for uploaded CVs

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production releases |
| `backend-api-foundation` | Full-stack CMS with API integration (release candidate) |
| `frontend-admin-complete` | Frontend-only snapshot (pre-backend) |

Feature work branches from `main` or the active development branch. Merge via pull request with passing tests.

## Architecture Notes

- **Single Source of Truth** — each content type has one owner CMS module
- **API-first** — admin modules call Laravel REST endpoints; no mock CRUD
- **Permissions** — 18-module permission matrix enforced on backend gates and frontend route guards
- **Sanctum** — bearer token auth stored in `localStorage`

## Testing

```bash
# Frontend
npm run lint

# Backend
cd backend && php artisan test
```
