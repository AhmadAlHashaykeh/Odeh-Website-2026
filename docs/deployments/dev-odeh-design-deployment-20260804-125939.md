# Odeh & Partners — Development Deployment Report

**Deployment timestamp:** 20260804-125939  
**Target:** https://dev.odeh-design.com/  
**Production domain:** not touched  

---

## 1. Deployment Summary

Deployed the approved local working tree (React/Vite frontend, Laravel backend, approved local MySQL database `odeh_cms`, and public media) to Hostinger development path `public_html/dev`.

Remote database `u235042127_odeh_dev` was replaced with the sanitized local dump after a verified remote backup. All entity counts matched after import.

Post-extract fix: restored document-root `index.php` to use `__DIR__/vendor` and `__DIR__/bootstrap` (the staged Laravel `public/index.php` incorrectly used parent-directory paths and caused HTTP 500s).

## 2. Local Git State

| Item | Value |
|------|-------|
| Branch | `backend-api-foundation` |
| Checkpoint commit | `72b4efe` — `chore: checkpoint before dev deployment` |
| Validation fix commit | `1ac172c` — `fix: align validation tests with approved project category slugs` |
| Deployed HEAD | `1ac172cfe1865ee79d4b16ef4e6a961ed083c297` |

## 3. Local Validation

| Check | Result |
|-------|--------|
| `npm install` | Pass |
| `npm run lint` | Pass (after JSDoc / test typing fixes) |
| `npm run test` | Pass — 13/13 |
| `npm run build` (dev API origin) | Pass — `dist/assets/index-CU1Nx6_n.js` |
| `composer install` | Pass (vendor already present) |
| `php artisan about` | Pass |
| `php artisan route:list` | Pass — 110 routes |
| `php artisan test` | Pass — 123/123 |
| `vendor/bin/pint --test` | Non-blocking style warnings (import order / FQCN) on 15 files |

## 4. Deployment Architecture

Preserved existing approved structure:

- Document root = Laravel application root + React `dist/` contents mixed in `/public_html/dev`
- API/SPA routing via root `.htaccess` (`/api` → `index.php`, other non-files → `index.html`)
- `public/storage` symlink → `storage/app/public`
- Not Laravel-public-only document root
- Not a separate frontend CDN root

## 5. Remote Paths

| Role | Path |
|------|------|
| SSH | `u235042127@147.93.54.75:65002` |
| Host | `fr-int-web1012.main-hosting.eu` |
| Dev project root / frontend docroot | `/home/u235042127/domains/odeh-design.com/public_html/dev` |
| Laravel backend (same tree) | `/home/u235042127/domains/odeh-design.com/public_html/dev` |
| Release staging | `/home/u235042127/releases/odeh-dev/20260804-125939` |
| PHP | 8.2.30 |
| Composer | 2.9.8 |

## 6. Remote Backup Paths

| Backup | Path |
|--------|------|
| Backup directory | `/home/u235042127/backups/odeh-dev/20260804-125939/` |
| Code tarball | `.../code-before-deploy.tar.gz` (~717MB) |
| Database dump | `.../database-before-deploy.sql` (~183KB) |
| Env copy | `.../env-before-deploy.env` |
| htaccess | `.../htaccess-before-deploy` |
| Storage public | `.../storage-public-before-deploy.tar.gz` |

## 7. Local Database Export

| Item | Value |
|------|-------|
| Local DB name | `odeh_cms` |
| Export path | `.tmp/deployments/dev-odeh-design-20260804-125939/local-approved-database.sql` |
| Size | 201,181 bytes |
| Validation | 27 `CREATE TABLE`, 22 `INSERT` blocks, utf8mb4, required CMS tables present |

## 8. Database Import

| Item | Value |
|------|-------|
| Remote DB name | `u235042127_odeh_dev` |
| Sanitized dump | `~/releases/odeh-dev/20260804-125939/local-approved-database.sanitized.sql` |
| Import result | Success |
| `php artisan migrate --force` | Nothing pending |
| Destructive commands | Not run (`migrate:fresh` / `db:wipe` / `db:seed` avoided) |

## 9. Database Count Reconciliation

| Entity | Local approved count | Remote count after import | Match |
|--------|---------------------:|--------------------------:|:-----:|
| Users | 1 | 1 | Yes |
| Roles | 5 | 5 | Yes |
| Role permissions | 90 | 90 | Yes |
| Services | 7 | 7 | Yes |
| Project categories | 9 | 9 | Yes |
| Projects | 67 | 67 | Yes |
| Activities | 4 | 4 | Yes |
| Team categories | 3 | 3 | Yes |
| Team ranks | 6 | 6 | Yes |
| Team members | 34 | 34 | Yes |
| Job postings | 6 | 6 | Yes |
| Job applications | 1 | 1 | Yes |
| Legal pages | 2 | 2 | Yes |
| Navigation/footer settings | 1 | 1 | Yes |
| Website settings | 1 | 1 | Yes |
| SEO pages | 112 | 112 | Yes |
| Super Admin users | 1 | 1 | Yes |

Public API confirmation: 34 team members with category + rank assignments retained.

## 10. Media Synchronisation

| Item | Result |
|------|--------|
| Public assets packaged | 68 project asset directories + site media (~80MB assets) |
| CMS `storage/app/public` | Included in release package (5 files) |
| Private CVs | Excluded from upload |
| `rsync --delete` | Not used |
| Storage symlink | Valid (`public/storage` → `../storage/app/public`) |
| Sample HTTPS images | 200 OK (`odeh-logo2.png`, Fairmont/Himmeh webp) |

## 11. Frontend Deployment

| Item | Result |
|------|--------|
| `VITE_API_BASE_URL` | `https://dev.odeh-design.com/api` |
| Bundle | `assets/index-CU1Nx6_n.js`, `assets/index-CyvXmK-5.css` |
| Localhost/127.0.0.1/5173/8000 in bundle | Absent |
| Admin + Team Categories routes in bundle | Present |
| SPA refresh routes | 200 via `index.html` fallback |

## 12. Backend Deployment

| Item | Result |
|------|--------|
| Upload method | `scp` release tarball + remote extract |
| `composer install --no-dev --optimize-autoloader` | Success (lock already satisfied) |
| Writable dirs | `storage/`, `bootstrap/cache/` (775/664, no 777) |
| Document-root `index.php` | Corrected after extract |

## 13. Environment Verification

Updated only non-secret deployment values; remote DB credentials/secrets preserved.

| Key | Value |
|-----|-------|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_URL` | `https://dev.odeh-design.com` |
| `DB_DATABASE` | `u235042127_odeh_dev` |
| CORS / Sanctum domains | Preserved for `dev.odeh-design.com` |
| `.env` public access | Denied (403) |

## 14. Laravel Cache Commands

Executed successfully:

- `php artisan optimize:clear`
- `php artisan config:cache`
- `php artisan route:cache`
- `php artisan view:cache`

## 15. Public Website Smoke Test

All checked public routes returned HTTP 200 with SPA shell:

`/`, `/about/overview`, `/about/team-members`, `/about/activities`, `/projects`, `/services`, `/careers`, `/reach-out`, `/connect`, project detail page.

Public APIs all 200 with no embedded localhost hosts: home, projects, team-members, services, activities, careers, legal-pages, website-settings, navigation-footer, seo, search, `/up`.

## 16. Admin Smoke Test

| Check | Result |
|-------|--------|
| `/admin/login` | 200 |
| `/admin/dashboard` | 200 (SPA shell) |
| `/admin/team-categories` | 200 (SPA shell) |
| `/admin/team-members` | 200 (SPA shell) |
| `/api/admin/team-categories` unauthenticated | 401 (expected) |
| Admin team-categories / team-ranks routes registered | Yes |

Login credentials were not exercised or recorded in this report.

## 17. Team Categories Verification

- Admin Team Categories page route included in frontend bundle
- Backend CRUD routes for team categories and team ranks present
- DB: 3 team categories, 6 ranks, 34 members
- Public members retain category + rank metadata (e.g. Board of Directors / Founder & Executive)

## 18. Media Verification

Representative HTTPS assets returned 200 with correct image MIME types and non-zero sizes. Project gallery paths under `/assets/projects/...` resolve. No localhost media URLs in public API JSON samples.

## 19. Console and Network Results

Automated HTTP checks only (no interactive browser login session in this run). No mixed-content/localhost API hosts detected in production bundle or public API payloads. Fresh Laravel log empty after post-fix smoke hits.

## 20. Laravel Log Review

Pre-fix logs contained historical errors including the broken parent-path `index.php` DB access issue. After fixing `index.php` and rotating the log, fresh log remained empty following API smoke requests.

## 21. Files Excluded from Deployment

- Local `.env` / secrets
- `node_modules`, Windows `vendor` upload (server used existing Composer vendor)
- `.git`, `.tmp` contents (except release packaging outside docroot)
- `storage/logs`, sessions/cache/views contents
- Private CV uploads
- SQL dumps were kept under `~/releases` and `~/backups` (outside `public_html`)

## 22. Remaining Issues

1. **Pint style warnings** remain locally (non-blocking import-order / FQCN style).
2. **Document-root `index.php` hazard:** future deploys must not overwrite root `index.php` with Laravel `public/index.php` parent-relative paths. Correct template saved at `.tmp/deployments/dev-odeh-design-20260804-125939/document-root-index.php`.
3. **Admin authenticated UI** was not logged into during this deployment (401 without token is correct); recommend a quick manual login check of Team Categories CRUD.
4. **Team categories count is 3** in the approved local DB (source of truth for this deploy). Members currently populate 2 named categories in public payloads; one category may be unused/empty.

## 23. Rollback Instructions

If rollback is required:

```bash
DEV=/home/u235042127/domains/odeh-design.com/public_html/dev
BK=/home/u235042127/backups/odeh-dev/20260804-125939

# 1) Restore code (preserve/restore .env carefully)
cp "$DEV/.env" /tmp/env-now
tar -xzf "$BK/code-before-deploy.tar.gz" -C "$DEV"
cp "$BK/env-before-deploy.env" "$DEV/.env"   # or merge intentionally
cp "$BK/htaccess-before-deploy" "$DEV/.htaccess"

# 2) Restore database
set -a; . "$DEV/.env"; set +a
mysql -h "$DB_HOST" -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" < "$BK/database-before-deploy.sql"

# 3) Rebuild caches
cd "$DEV"
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
```

Do not use this backup against production.

## 24. Final Status

**SUCCESS** — development deployment to `https://dev.odeh-design.com/` completed with matching database counts, working public APIs, SPA routes, media samples, and preserved remote secrets. Production root was not modified.
