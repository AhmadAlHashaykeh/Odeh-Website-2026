# Odeh & Partners — Full Local → DEV Deployment Report

**Deployment timestamp:** 20260810-185412  
**Target:** https://dev.odeh-design.com/  
**Environment:** DEV / STAGING (`public_html/dev`)  
**Production domain:** not touched  

---

## 1. Deployment Result

**SUCCESS**

| Item | Value |
|------|-------|
| Target URL | https://dev.odeh-design.com/ |
| Environment | DEV (`APP_URL=https://dev.odeh-design.com`, DB `u235042127_odeh_dev`) |
| Date/time | 2026-08-10 ~18:54–19:03 Asia/Amman (UTC 15:54–16:03) |
| Result | Local code + database + media deployed; verification passed |

## 2. Source of Truth

Confirmed: **current local project** was the authoritative source for application code, MySQL content, CMS data, projects, galleries, static assets, and seed sources.

Server-specific configuration preserved: remote `.env` (DB credentials, APP_KEY, CORS/Sanctum), remote `.htaccess`, document-root hosting layout.

## 3. Local Baseline

| Item | Value |
|------|-------|
| Branch | `backend-api-foundation` |
| HEAD (pre-checkpoint) | `1ac172cfe1865ee79d4b16ef4e6a961ed083c297` |
| Working tree | Dirty (content/CMS/UI updates + new project assets after prior checkpoint) |
| Laravel | 12.62.0 |
| PHP (local) | 8.2.12 |
| PHP requirement | ^8.2 |
| Node | v22.23.1 / npm 10.9.8 |
| Frontend | React 18 + Vite 5 |
| Local DB | `odeh_cms` |
| Projects | **97** |
| Project categories | **10** |
| Gallery items (DB) | **397** |
| Users | 2 |
| Roles / role_permissions | 5 / 90 |
| Services | 7 |
| Activities | 4 |
| Team members / categories / ranks | 42 / 3 / 6 |
| Job postings / applications | 0 / 0 |
| Legal pages | 2 |
| SEO pages | 137 |
| Website / nav-footer / home / about / connect settings | 1 each |
| Migrations recorded | 27 |
| Local project asset dirs | 98 |
| Local `storage/app/public` files | 56 |

## 4. Server Before Deployment

| Item | Value |
|------|-------|
| Host | `fr-int-web1012.main-hosting.eu` |
| Path | `/home/u235042127/domains/odeh-design.com/public_html/dev` |
| PHP | 8.2.30 |
| Projects | 67 |
| Categories | 9 |
| Users | 1 |
| Team members | 34 |
| SEO pages | 112 |
| Job postings / applications | 6 / 1 |
| Storage public files | 6 |
| Asset project dirs | 105 |
| Last prior deploy | 20260804-125939 |

Important differences vs local: local had +30 projects, +1 category, +8 team members, +1 user, +25 SEO pages; local job board empty (0/0) vs previous server 6/1.

## 5. Backups

| Backup | Path |
|--------|------|
| Server backup dir | `/home/u235042127/backups/odeh-dev/20260810-185412/` |
| Server DB dump | `.../database-before-deploy.sql` (~200KB, 27 CREATE TABLE, 22 INSERT) |
| Server code tarball | `.../code-before-deploy.tar.gz` (~271MB) |
| Server storage | `.../storage-public-before-deploy.tar.gz` (~123KB) |
| Server config | `.../env-before-deploy.env`, `htaccess-before-deploy`, `index-php-before-deploy.php` |
| Fresh local DB export | `.tmp/deployments/dev-odeh-design-20260810-185412/local-approved-database.sql` (~225KB, 27 CREATE TABLE) |
| Release package | `~/releases/odeh-dev/20260810-185412/` |

## 6. Files Deployed

| Area | Summary |
|------|---------|
| Frontend | Fresh Vite build `index-CA6dzrTy.js` / `index-7t0NvZKH.css` with `VITE_API_BASE_URL=https://dev.odeh-design.com/api` |
| Backend | Laravel app/config/routes/database/resources flattened into DEV docroot |
| Build | `dist/` mixed into docroot (`index.html` + `assets/`) |
| Project assets | `public/assets/projects/*` → `assets/projects/*` (98 local dirs packaged) |
| CMS storage | Local `storage/app/public/uploads/**` synchronized |
| Entry | Document-root `index.php` forced to `__DIR__/vendor` + `__DIR__/bootstrap` (not parent-relative) |
| Excluded | Local `.env`, `node_modules`, Windows `vendor` upload, `.git`, `.tmp` dumps, backups, private keys, import temp scripts |

Upload method: `scp` release tarball + remote extract (no `rsync --delete`, no broad `rm -rf`).

## 7. Database Deployment

| Step | Result |
|------|--------|
| Local DB exported | Yes (`odeh_cms`) |
| Server DB backed up | Yes |
| Server DB content replaced | Yes (sanitized dump; no `USE odeh_cms`) |
| Import success | `DB_IMPORT=ok` |
| `php artisan migrate --force` | Nothing pending |
| Destructive artisan DB commands | Not run |
| Credentials | Preserved in remote `.env` (not imported from local) |

Post-import remote counts matched local exactly (97/10/42/2/137/…).

## 8. Local vs Server Verification

| Entity | Local | Server after | Match |
|--------|------:|-------------:|:-----:|
| Projects | 97 | 97 | Yes |
| Project categories | 10 | 10 | Yes |
| Users | 2 | 2 | Yes |
| Roles | 5 | 5 | Yes |
| Role permissions | 90 | 90 | Yes |
| Services | 7 | 7 | Yes |
| Activities | 4 | 4 | Yes |
| Team categories | 3 | 3 | Yes |
| Team ranks | 6 | 6 | Yes |
| Team members | 42 | 42 | Yes |
| Job postings | 0 | 0 | Yes |
| Job applications | 0 | 0 | Yes |
| Legal pages | 2 | 2 | Yes |
| SEO pages | 137 | 137 | Yes |
| Website settings | 1 | 1 | Yes |
| Nav/footer | 1 | 1 | Yes |
| Migrations | 27 | 27 | Yes |
| Public API projects | — | 97 | Yes |
| Public API categories | — | 10 | Yes |
| Public API team | — | 42 | Yes |

Category project counts (API): commercial 14, fueling 2, governmental 3, hospitals 4, institutional 5, mosques 3, private villas 34, residential 13, resort/hotel 5, steel 14 (=97).

## 9. Projects Verification

| Check | Result |
|------|--------|
| Categories appear | All 10 category SPA routes HTTP 200 |
| Project listing API | 97 projects |
| Project details | Sample detail pages + APIs HTTP 200 (incl. steel/`yamaha`) |
| Cover + gallery files | **494/494 media refs valid, 0 missing** |
| Steel projects | 14 present |
| REV.03 / later imports | Sample slugs present (e.g. abdali, byzantine church, port-de-amman, icon-mall, yamaha) |
| Broken media | None detected by filesystem audit |
| Extra remote asset dirs | Server still has older unused dirs under `assets/projects` (135 dirs listed) because delete-sync was intentionally not used |

## 10. Website Verification

All checked public SPA routes returned **HTTP 200**:

`/`, `/about/overview`, `/about/team-members`, `/about/activities`, `/projects`, `/projects/{category}`, sample `/projects/{category}/{slug}`, `/services`, `/careers`, `/reach-out`, `/connect`, `/search`.

## 11. Admin/CMS Verification

| Check | Result |
|------|--------|
| `/admin/login` and module SPA shells | HTTP 200 |
| Admin APIs without auth | HTTP **401** (expected) for projects, categories, team-categories, users |
| Authenticated CRUD UI login | Not exercised with credentials (read-only preference) |

## 12. API Verification

Public APIs HTTP 200: `/up`, home, projects, project-categories, team-members, services, activities, careers, legal-pages, website-settings, navigation-footer, seo, search, about, connect.

| Note | Detail |
|------|--------|
| Localhost in payloads | 1 occurrence in `/api/public/home` about-image `url` field (`http://127.0.0.1:8000/...`) while `path` is correct `/storage/...` |
| Asset itself | `/storage/uploads/home-page/aboutimage-bb7ei6yiklut.webp` returns HTTP 200 |
| Frontend mitigation | `resolveMediaUrl` prefers relative `/storage` path when absolute URL host mismatches API origin |

## 13. Tests / Build

| Check | Result |
|------|--------|
| `npm run build` (DEV API) | Pass — `index-CA6dzrTy.js` |
| Dev hosts in bundle | Absent |
| `dev.odeh-design.com/api` in bundle | Present |
| `npm run test` | Pass — 13/13 |
| Composer on server | Lock satisfied; optimized autoload |
| Laravel caches | optimize:clear + config/route/view cache OK |

## 14. Git

See post-deploy checkpoint section in final status after commit step.

## 15. Deployment Safety

| Control | Confirmed |
|---------|-----------|
| Server file backup exists | Yes |
| Server database backup exists | Yes |
| `.env` preserved | Yes |
| Secrets not committed / not uploaded from local `.env` | Yes |
| Local DB became server DB content | Yes |
| Project assets synchronized from local | Yes |
| No unexpected project/media loss | Yes (0 missing media refs) |
| Storage symlink works | Yes (`public/storage` → `../storage/app/public`) |
| Target environment only modified | Yes — DEV only |

SSH note: connect via `odeh-design.com:65002` (direct IP `147.93.54.75` was intermittently unreachable from this network).

## 16. Remaining Issues

1. **One localhost absolute media URL** remains inside home CMS JSON (`url` field). Path/file are valid; frontend rewrites for display. Optional follow-up: normalize stored media URLs under production `APP_URL` in local DB then redeploy, or harden `PublicMediaUrl` to rewrite localhost hosts server-side.
2. **Extra historical asset directories** remain on server (135 vs local 98 packaged dirs) because destructive delete-sync was avoided. Harmless leftover folders.
3. **Admin authenticated UI** not logged into during this run (401 without token is correct).
4. **Python urllib SSL verify** reported an expired cert check against this host; browser/curl/`Invoke-WebRequest` still received HTTP 200. Worth confirming Hostinger SSL status in hPanel if clients report TLS warnings.
5. **Job postings are intentionally 0** on local/server after this authoritative import (previous server had 6). Confirm this matches editorial intent.

## 17. Rollback

```bash
DEV=/home/u235042127/domains/odeh-design.com/public_html/dev
BK=/home/u235042127/backups/odeh-dev/20260810-185412

cp "$DEV/.env" /tmp/env-now
tar -xzf "$BK/code-before-deploy.tar.gz" -C "$DEV"
cp "$BK/env-before-deploy.env" "$DEV/.env"
cp "$BK/htaccess-before-deploy" "$DEV/.htaccess"
cp "$BK/index-php-before-deploy.php" "$DEV/index.php"

set -a; . "$DEV/.env"; set +a
mysql -h "$DB_HOST" -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_DATABASE" < "$BK/database-before-deploy.sql"

cd "$DEV"
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
```

Do not use this backup against production.

---

**FINAL STATUS:** SUCCESS — current local website is now the deployed DEV website for code, database content, CMS, projects, images, and settings, with server secrets/hosting config preserved.
