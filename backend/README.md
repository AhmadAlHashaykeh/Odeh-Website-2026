# ODEH & PARTNERS — CMS Backend API

Laravel 12 REST API powering the ODEH website admin CMS and public form submissions.

## Requirements

- PHP 8.2+
- Composer 2.x
- MySQL 8+ (or MariaDB 10.4+)
- Node.js 18+ (for the frontend SPA in the parent directory)

## Installation

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure database credentials in `.env`, then:

```bash
php artisan migrate --seed
php artisan storage:link
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `APP_URL` | API base URL (e.g. `http://localhost:8000`) |
| `APP_DEBUG` | Set `false` in production |
| `DB_*` | MySQL connection settings |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins |
| `SANCTUM_STATEFUL_DOMAINS` | SPA domains for Sanctum (if using cookies) |
| `FILESYSTEM_DISK` | `local` for development; S3-compatible disk for production media |

See `.env.example` for the full list.

## Database

```bash
# Fresh install with seed data
php artisan migrate:fresh --seed

# Run migrations only
php artisan migrate
```

Seeders provision roles, permissions, CMS singleton settings, legal pages, SEO registry, and a development super-admin account.

## Running the API

```bash
php artisan serve
```

API base URL: `http://localhost:8000/api`

## Tests

```bash
php artisan test
```

Feature tests cover authentication, authorization, CRUD modules, dashboard stats, public contact/job application endpoints, and CMS singleton settings.

## API Authentication

The admin SPA uses **Laravel Sanctum** bearer tokens.

| Endpoint | Method | Auth |
|----------|--------|------|
| `/api/auth/login` | POST | Public |
| `/api/auth/logout` | POST | Bearer token |
| `/api/auth/user` | GET | Bearer token |

Login request:

```json
{ "email": "admin@odeh.local", "password": "OdehLocalDev2026!" }
```

Response includes `token`, `user`, `role`, and a `permissions` map keyed by CMS module.

All `/api/admin/*` routes require a valid bearer token and enforce module-level gates (`view`, `create`, `update`, `delete`).

## Default Admin Account (Development Only)

Created by `SuperAdminSeeder` when running `migrate --seed`:

| Field | Value |
|-------|-------|
| Email | `admin@odeh.local` |
| Password | `OdehLocalDev2026!` |
| Role | Super Admin |

**Change or remove this account before deploying to production.**

## Public Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/public/contact` | POST | Reach Out / contact form |
| `/api/public/jobs/{slug}/applications` | POST | Job application with CV upload (multipart) |

## Deployment

1. Set `APP_ENV=production`, `APP_DEBUG=false`
2. Run `composer install --no-dev --optimize-autoloader`
3. Run `php artisan migrate --force`
4. Run `php artisan config:cache`, `route:cache`, `view:cache`
5. Configure web server document root to `public/`
6. Ensure `storage/` and `bootstrap/cache/` are writable
7. Configure CORS for the production frontend origin
8. Use a private disk for CV uploads (`storage/app/private`)

## Project Structure

```
backend/
├── app/Http/Controllers/Api/   # REST controllers
├── app/Http/Requests/          # Form request validation
├── app/Http/Resources/         # API response transformers
├── app/Models/                 # Eloquent models
├── app/Support/CmsModules.php  # Permission module registry
├── database/migrations/        # Schema
├── database/seeders/           # Seed data
├── routes/api.php              # API route definitions
└── tests/Feature/              # Feature tests
```
