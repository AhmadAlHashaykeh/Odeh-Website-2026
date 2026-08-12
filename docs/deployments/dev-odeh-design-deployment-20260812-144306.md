# Odeh & Partners — Full Local → DEV Redeployment Report

**Deployment timestamp:** 20260812-144306  
**Target:** https://dev.odeh-design.com/  
**Environment:** DEV ONLY (`public_html/dev`)  
**Production:** not touched  

---

## 1. Deployment Result

**SUCCESS**

| Item | Value |
|------|-------|
| Target URL | https://dev.odeh-design.com/ |
| Environment | DEV (`APP_URL=https://dev.odeh-design.com`, DB `u235042127_odeh_dev`) |
| Date/time | 2026-08-12 ~14:43–14:50 Asia/Amman (UTC 11:43–11:50) |
| Result | Current local code + database + media deployed; verification passed |

## 2. Current Local Source

| Item | Value |
|------|-------|
| Branch | `backend-api-foundation` |
| HEAD (pre-checkpoint) | `0fee954a581d73412c7ad5c269ad1941c8714ced` |
| Working tree | Dirty before checkpoint (team/about/home/admin UI + seed data updates) |
| Laravel | 12.62.0 |
| PHP (local) | 8.2.12 |
| PHP requirement | ^8.2 |
| Node / npm | v22.23.1 / 10.9.8 |
| Frontend | React 18 + Vite 5 |
| Local DB | `odeh_cms` |

## 3. Local Authoritative Counts

| Entity | Count |
|--------|------:|
| Projects | 97 |
| Project categories | 9 |
| Gallery items | 397 |
| Users | 2 |
| Roles / role_permissions | 5 / 90 |
| Services | 7 |
| Activities | 4 |
| Team members / categories / ranks | 42 / 4 / 6 |
| Job postings / applications | 0 / 0 |
| Legal pages | 2 |
| SEO pages | 136 |
| Website / nav-footer / home / about / connect | 1 each |
| Contact messages | 1 |
| Migrations recorded | 27 |
| Tables | 27 |
| Local project asset dirs | 98 |
| Local `storage/app/public` files | 56 |
| Project media refs | 494 valid / 0 missing |
| CMS storage refs | 41 valid / 0 missing |

Category project counts: commercial 14, governmental 3, hospitals 4, institutional 5, mosques 3, private villas 34, residential 13, resort/hotel 5, steel 16 (=97).

## 4. DEV Before Deployment

| Item | Value |
|------|-------|
| Host | `fr-int-web1012.main-hosting.eu` |
| Path | `/home/u235042127/domains/odeh-design.com/public_html/dev` |
| PHP | 8.2.30 |
| Prior deploy | 20260810-185412 |
| Projects | 97 |
| Categories | 10 |
| Team members / categories | 42 / 3 |
| SEO pages | 137 |
| Users | 2 |
| Storage public files | 57 |
| Asset project dirs | 135 |

Local deltas vs previous DEV: categories 10→9, team categories 3→4, SEO 137→136, steel projects increased (fueling category no longer present in approved local DB).

## 5. Backups

| Backup | Path |
|--------|------|
| Server backup dir | `/home/u235042127/backups/odeh-dev/20260812-144306/` |
| Server DB dump | `.../database-before-deploy.sql` (~223KB, 27 CREATE TABLE) |
| Server code tarball | `.../code-before-deploy.tar.gz` (~347MB) |
| Server storage | `.../storage-public-before-deploy.tar.gz` (~2.7MB) |
| Server config | `.../env-before-deploy.env`, `htaccess-before-deploy`, `index-php-before-deploy.php` |
| Fresh local SQL export | `.tmp/deployments/dev-odeh-design-20260812-144306/local-approved-database.sql` (~229KB) |
| Sanitized import SQL | `.tmp/deployments/dev-odeh-design-20260812-144306/local-approved-database.sanitized.sql` |
| Release package | `~/releases/odeh-dev/20260812-144306/` |

## 6. Deployment Changes

| Area | Summary |
|------|---------|
| Frontend | Fresh Vite build `index-SYa4Fh77.js` / `index-Dw337cdo.css` with `VITE_API_BASE_URL=https://dev.odeh-design.com/api` |
| Backend | Laravel app/config/routes/database/resources flattened into DEV docroot |
| Build | `dist/` mixed into docroot (`index.html` + `assets/`) |
| Project assets | `public/assets/projects/*` → `assets/projects/*` (98 local dirs packaged) |
| CMS storage | Local `storage/app/public/uploads/**` synchronized |
| Entry | Document-root `index.php` forced to `__DIR__/vendor` + `__DIR__/bootstrap` (BOM-free) |
| Excluded | Local `.env`, `node_modules`, Windows vendor upload, `.git`, `.tmp` dumps, `backups/`, private keys, import temp scripts |

Upload method: `scp` release tarball + remote extract (no `rsync --delete`, no broad `rm -rf`).

## 7. Database Replacement

| Step | Result |
|------|--------|
| Local DB exported | Yes (`odeh_cms`) |
| Server DB backed up | Yes |
| Server DB content replaced | Yes (sanitized dump; no `USE odeh_cms`) |
| Import success | `DB_IMPORT=ok` |
| `php artisan migrate --force` | Nothing pending |
| Destructive artisan DB commands | Not run |
| Credentials | Preserved in remote `.env` |

## 8. Local ↔ DEV Comparison

| Entity | Local | DEV after | Match |
|--------|------:|----------:|:-----:|
| Projects | 97 | 97 | Yes |
| Project categories | 9 | 9 | Yes |
| Users | 2 | 2 | Yes |
| Roles | 5 | 5 | Yes |
| Role permissions | 90 | 90 | Yes |
| Services | 7 | 7 | Yes |
| Activities | 4 | 4 | Yes |
| Team categories | 4 | 4 | Yes |
| Team ranks | 6 | 6 | Yes |
| Team members | 42 | 42 | Yes |
| Job postings | 0 | 0 | Yes |
| Job applications | 0 | 0 | Yes |
| Legal pages | 2 | 2 | Yes |
| SEO pages | 136 | 136 | Yes |
| Website settings | 1 | 1 | Yes |
| Nav/footer | 1 | 1 | Yes |
| Migrations | 27 | 27 | Yes |
| Public API projects | — | 97 | Yes |
| Public API categories | — | 9 | Yes |
| Public API team | — | 42 | Yes |

## 9. Projects Verification

| Check | Result |
|------|--------|
| Categories appear | All 9 category SPA routes HTTP 200 |
| Project listing API | 97 projects |
| Project details | Sample detail pages + APIs HTTP 200 (yamaha, a-k-residence, abdali, byzantine church) |
| Cover + gallery files | **494/494 media refs valid, 0 missing** |
| Broken media | None |
| Extra remote asset dirs | 135 dirs on server vs 98 packaged local dirs (intentional non-destructive sync) |

## 10. Public Website Verification

All checked public SPA routes returned **HTTP 200**:

`/`, `/about/overview`, `/about/team-members`, `/about/activities`, `/projects`, `/projects/{category}` (all 9), sample `/projects/{category}/{slug}`, `/services`, `/careers`, `/reach-out`, `/connect`, `/search`.

Sample assets: `/assets/projects/yamaha/01.webp` → 200; CMS storage sample → 200.

## 11. Admin/API Verification

| Check | Result |
|------|--------|
| `/admin/login`, `/admin/dashboard`, `/admin/projects` | HTTP 200 |
| Admin APIs without auth | HTTP **401** for projects, categories, team, users, services, activities, jobs, home, about, website-settings, legal, navigation-footer, connect, seo, job-applications, contact-messages, roles |
| Authenticated CRUD UI login | Not exercised with credentials |

Public APIs HTTP 200: `/up`, home, projects, project-categories, team-members, services, activities, careers, legal-pages, website-settings, navigation-footer, seo, search, about, connect.

## 12. Server Health

| Check | Result |
|------|--------|
| Storage link | `public/storage` → `../storage/app/public` |
| Permissions | `storage/`, `bootstrap/cache` group-writable (775/664 style); no global 777 |
| Document root `index.php` | `__DIR__`-based paths; no parent-relative regression |
| `.htaccess` | SPA + API + storage rewrite preserved |
| Laravel caches | optimize:clear + config/route/view cache OK |
| Today’s log errors | None (`NO_TODAY_ERRORS`); older Aug 10 DB noise ignored |

## 13. Tests / Build

| Check | Result |
|------|--------|
| `php artisan test` | Pass — 123 tests |
| `npm run test` | Pass — 13/13 |
| `npm run build` (DEV API) | Pass — `index-SYa4Fh77.js` / `index-Dw337cdo.css` |
| Dev hosts in bundle | Absent |
| `dev.odeh-design.com/api` in bundle | Present |

## 14. Git Result

| Item | Value |
|------|-------|
| Branch | `backend-api-foundation` |
| Checkpoint commit | see git section after commit |
| Push result | see git section after push |
| Intentionally untracked | `backups/`, `.tmp/`, temporary Steel/REV.03 import scripts under `scripts/` and `backend/scripts/` |

## 15. Remaining Issues

1. **Extra historical asset directories** remain on server (135 vs local 98 packaged dirs) because destructive delete-sync was avoided. Harmless leftover folders.
2. **Older Vite bundles** may still exist under `assets/` (`index-CA6dzrTy.js`, etc.); live `index.html` references `index-SYa4Fh77.js`.
3. **Admin authenticated UI** not logged into during this run (401 without token is correct).
4. **One localhost absolute media URL** may still exist inside home CMS JSON `url` fields; path/file are valid and frontend rewrites for display.
5. **Remote storage file count 57 vs local 56** — one leftover server file retained under non-destructive sync; DB-referenced media all valid.

## 16. Rollback

```bash
DEV=/home/u235042127/domains/odeh-design.com/public_html/dev
BK=/home/u235042127/backups/odeh-dev/20260812-144306

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
