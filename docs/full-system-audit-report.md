# Odeh & Partners — Full System Audit Report

**Audit date:** 2026-07-27  
**Environment audited:** Local development (`http://127.0.0.1:5173` frontend, `http://127.0.0.1:8000` Laravel API, MySQL `odeh_cms`)  
**Git checkpoint:** tag `audit-checkpoint-2026-07-27` @ `c385828685e2397d0e1a968de53478a7c40f8663`  
**Mode:** Report only — no redesign and no broad functional fixes were applied during this audit.

---

## 1. Executive Summary

The Odeh & Partners system is a **single React/Vite SPA** (public site + `/admin/*` CMS) backed by **Laravel 12 + Sanctum** APIs. Core content APIs are largely healthy: **18/18 public GETs OK**, **19/19 admin GETs OK** (authenticated), **123/123 backend PHPUnit tests passed**, and Vite **production build succeeded**.

The highest-impact confirmed problems are:

1. **Misconfigured `APP_URL=http://localhost`** — uploaded `/storage/...` media URLs resolve to XAMPP (`http://localhost/storage/...`) instead of the API host (`http://127.0.0.1:8000/storage/...`). Seeded content currently uses frontend `/assets/...` paths, which masks this until CMS uploads are used.
2. **Service detail pages are unfinished placeholders** — `/services/:slug` shows “Coming Soon”, while Search/SEO still deep-link into those routes.
3. **Corrupt published project record** — project titled `885` has empty `slug` and media paths like `/assets/projects//cover.webp` that load as Vite HTML (`200 text/html`) and render as broken images in rotating category cards.
4. **Legal pages exist but are unreachable from footer/nav** — `/privacy-policy` and `/terms-and-conditions` work by direct URL; CMS footer API currently exposes no legal links, and Footer code also excludes privacy/terms paths.
5. **Admin “Published on Website” form field is misleading** — UI exposes a `published` toggle that is **not** sent by `mapFormValuesToApi`; only `status` persists.

Admin modules (including Team Categories) are present in sidebar and routes for Super Admin. Permission gating works for a Content Manager role (projects allowed; users/SEO/jobs denied). Leftover `Phase7 Audit Member` rows (null photos) pollute the public team listing.

---

## 2. Audit Scope

| In scope | Out of scope |
|---|---|
| Public website routes/pages | Visual redesign |
| Admin dashboard modules/CRUD UI wiring | Broad code fixes |
| Laravel public + admin APIs | Production host (dev.odeh-design.com) live deploy audit |
| Media URL pipeline + storage symlink | Load/performance tuning |
| Auth, roles, permissions | Email deliverability beyond mailer=log |
| DB ↔ API ↔ UI reconciliation (local MySQL) | Destructive reseeding |
| Build/lint/test commands | Mobile device lab matrix beyond viewport emulation |

**Methods used:** architecture discovery, route/module inventory from source, live API probing, DB inspection, browser testing (Cursor browser), media HTTP verification, Laravel logs review, PHPUnit + Vitest + `tsc` + Vite build + Pint `--test`.

---

## 3. Environment and Architecture

### 3.1 Application topology

| Layer | Technology | Entry | Port / URL |
|---|---|---|---|
| Public + Admin frontend | React 18.3 + Vite 5.4 + React Router 6 | `index.html` → `src/main.jsx` → `src/App.jsx` | `http://127.0.0.1:5173` |
| Backend API | Laravel **12.62.0**, PHP **8.2.12** | `backend/bootstrap/app.php`, `backend/routes/api.php` | `http://127.0.0.1:8000/api` |
| Database | MySQL | `DB_DATABASE=odeh_cms` | `127.0.0.1:3306` |

**Public website and admin dashboard are one SPA** with different layouts/routes (`/admin/*`), not separate apps.

### 3.2 Auth and permissions

- Auth: **Laravel Sanctum** bearer token (`localStorage` key `odeh_auth_token`)
- Model: `App\Models\User`
- Roles: custom `roles` + `role_permissions` (no Spatie)
- Super Admin slug: `super-admin` (Gate bypass)
- Module registry: `backend/app/Support/CmsModules.php` (18 modules)
- Frontend nav id `careers` maps to permission module `jobs` via `useModulePermissions.js`

### 3.3 API prefixes

| Prefix | Auth |
|---|---|
| `/api/public/*` | None |
| `/api/auth/*` | login public; logout/user Sanctum |
| `/api/admin/*` | `auth:sanctum` + module Gates |

Route inventory from `php artisan route:list`: **105** routes (**24** public, **74** admin, **3** auth).

### 3.4 Media / storage

| Item | Observed value |
|---|---|
| Public disk root | `backend/storage/app/public` |
| Symlink | `backend/public/storage` → linked (**confirmed**) |
| `APP_URL` (runtime) | `http://localhost` (**misconfigured for artisan serve**) |
| `filesystems.disks.public.url` | `http://localhost/storage` |
| Seeded media style | Relative `/assets/...` served by Vite `public/` |
| Uploaded media style | `/storage/...` via `PublicMediaUrl` + `ImageUploadService` |
| CV storage | `private` disk |

Frontend normalisation: `src/utils/mediaUrl.ts` rewrites mismatched storage hosts when a relative `/storage/...` path is available.

### 3.5 Frontend API base

- `.env.example`: `VITE_API_BASE_URL=http://127.0.0.1:8000/api`
- Client: `src/api/client.ts` (native `fetch`, not axios)
- No Vite proxy — browser calls Laravel origin directly (CORS allowlist includes `127.0.0.1:5173`)

### 3.6 Dev / build commands

| Area | Commands |
|---|---|
| Frontend | `npm install`, `npm run dev`, `npm run build`, `npm run lint` (`tsc --noEmit`), `npm run test` (Vitest) |
| Backend | `composer install`, `php artisan serve`, `php artisan test`, `php artisan storage:link` |

### 3.7 Navigation / CMS registries

| Surface | Source |
|---|---|
| Public navbar/footer | CMS `navigation-footer` via `PublicSiteContext` |
| Admin sidebar | `src/modules/admin/config/adminNavigation.js` |
| Permission modules | `CmsModules.php` + users-roles mock config |
| Form schemas | `moduleFormSchemas.js` |

---

## 4. Commands and Tests Executed

| Command | Result | Notes |
|---|---|---|
| `php artisan about` | Pass | Laravel 12.62.0, env local, debug on |
| `php artisan route:list --json` | Pass | 105 routes |
| `php artisan config:show filesystems` | Pass | public URL `http://localhost/storage` |
| `php artisan test` | **Pass** | **123 passed** (540 assertions) |
| `npm run test` | **Pass** | **11 passed** / 3 files |
| `npm run build` | **Pass** | chunk size warning (>500kB) |
| `npm run lint` (`tsc --noEmit`) | **Fail** | 5 TS errors in test files (exit 2) |
| `vendor/bin/pint --test` | **Fail** | style issues across many PHP files |
| `phpstan` | **Not configured** | no `vendor/bin/phpstan` |
| Custom API/media audit scripts | Pass | under `.tmp/audit/` (diagnostic only) |

---

## 5. Public Website Route Inventory

| Route | Page component | API endpoint(s) | Status | Navigation source | Notes |
|---|---|---|---|---|---|
| `/` | `HomePage` | `/public/home`, projects, services, nav, settings, seo | OK (after load) | Nav Home | Brief skeleton during fetch |
| `/about/overview` | `AboutOverviewPage` | `/public/about` | OK | About dropdown | |
| `/about/approach` | `AboutApproachPage` | `/public/about` | OK | About dropdown | |
| `/about/history` | `AboutHistoryPage` | `/public/about` | OK | About dropdown | |
| `/about/team-members` | `AboutTeamPage` | `/public/team-members` | OK | About dropdown | Includes leftover audit members |
| `/about/activities` | `AboutActivitiesPage` | `/public/activities` | OK | About dropdown | |
| `/about/activities/:slug` | `AboutActivityDetailPage` | `/public/activities/{slug}` | OK | Activity cards | Invalid slug → API 404 |
| `/about/:section` | `PlaceholderPage` | — | **Placeholder** | Direct URL only | Typos become “Coming Soon” |
| `/projects` | `ProjectsPage` | `/public/projects` | OK | Nav | Broken image from empty-slug project in rotation |
| `/projects/:category` | `ProjectCategoryPage` | projects + categories | OK | Category cards | |
| `/projects/:category/:project` | `ProjectDetailPage` | `/public/projects/{cat}/{slug}` | OK | Project cards | Empty slug project unroutable |
| `/services/:slug` | `PlaceholderPage` | list only `/public/services` | **Placeholder** | Search/SEO | No public show endpoint |
| `/careers` | `CareersPage` | `/public/careers`, `/public/jobs` | OK | Nav | 5 open jobs |
| `/careers/:slug` | `JobDetailPage` | `/public/jobs/{slug}` | OK | Job cards | Closed job excluded from public list |
| `/careers/:slug/apply` | `JobApplicationPage` | `POST /public/jobs/{slug}/applications` | OK shell | Apply CTA | Form not fully browser-submitted in this audit |
| `/careers/:slug/apply/thank-you` | `JobApplicationThankYouPage` | — | OK shell | Post-submit | |
| `/reach-out` | `ReachOutPage` | `/public/reach-out`, `POST /public/contact` | OK | Nav | |
| `/connect` | `ConnectPage` | `/public/connect` | OK | Not in main nav | Link hub page |
| `/search` | `SearchPage` | `/public/search`, suggestions | OK | Footer / search UI | Service hits → placeholders |
| `/privacy-policy` | `PrivacyPolicyPage` | `/public/legal-pages/{slug}` | OK direct | **Missing from footer** | |
| `/terms-and-conditions` | `TermsAndConditionsPage` | legal-pages | OK direct | **Missing from footer** | |
| `/terms` | redirect | — | OK | Legacy | → terms-and-conditions |
| `/thank-you` | `ThankYouPage` | — | OK shell | Contact flow | |
| `*` | `NotFoundPage` | — | OK | — | |

**Public routes discovered:** 24 route patterns (including dynamic + redirects + catch-alls)  
**Public routes tested (browser and/or HTTP shell + API):** all listed above

---

## 6. Admin Dashboard Module Inventory

| Module | Sidebar item | Frontend route | Page exists | API exists | Permission exists | CRUD status |
|---|---|---|---|---|---|---|
| Dashboard | Yes | `/admin/dashboard` | Yes | `GET admin/dashboard/stats` | `dashboard` | Read |
| Projects | Yes | `/admin/projects` | Yes | apiResource `projects` | `projects` | Full (tests + list verified) |
| Project Categories | Yes | `/admin/project-categories` | Yes | apiResource | `project-categories` | Full |
| Services | Yes | `/admin/services` | Yes | apiResource | `services` | Full |
| Activities | Yes | `/admin/activities` | Yes | apiResource | `activities` | Full |
| About Pages | Yes | `/admin/about-pages` | Yes | singleton GET/PUT | `about-pages` | Update |
| Team Categories | Yes | `/admin/team-categories` | Yes | apiResource + reorder | `team-categories` | Full |
| Team Members | Yes | `/admin/team-members` | Yes | apiResource | `team-members` | Full |
| Careers (Jobs) | Yes (`careers`) | `/admin/careers` | Yes | apiResource `jobs` | `jobs` (aliased) | Full |
| Applications | Yes | `/admin/applications` | Yes | `job-applications` | `applications` | Read/Update (+ CV) |
| Contact Messages | Yes | `/admin/contact-messages` | Yes | contact-messages | `contact-messages` | Read/Update |
| Home Page | Yes | `/admin/home-page` | Yes | singleton | `home-page` | Update |
| Navigation & Footer | Yes | `/admin/navigation-footer` | Yes | singleton | `navigation-footer` | Update |
| Connect Page | Yes | `/admin/connect-page` | Yes | singleton | `connect-page` | Update |
| Legal Pages | Yes | `/admin/legal-pages` | Yes | show/update by slug | `legal-pages` | Update only (no create/delete routes) |
| SEO | Yes | `/admin/seo` | Yes | index/show/patch | `seo` | Update |
| Website Settings | Yes | `/admin/website-settings` | Yes | GET/PUT/PATCH section | `website-settings` | Update |
| Users & Roles | Yes | `/admin/users-roles` | Yes | users, roles, permissions | `users-roles` | Full |
| Login | Guest | `/admin/login` | Yes | `/auth/login` | — | Auth |

**Explicit findings:**
- No missing sidebar items relative to `CmsModules` for Super Admin (Team Categories is present).
- No orphan sidebar links to missing routes observed.
- Dual naming `careers` (UI) vs `jobs` (API/permissions) is intentional and aliased.

---

## 7. Critical Issues

### ISSUE-001 — `APP_URL` / public disk URL points at `http://localhost` (not API `:8000`)

- Severity: Critical
- Status: Confirmed
- Area: Backend / Media
- Route or page: Any CMS-uploaded image using `/storage/...`
- Related record: N/A (configuration); sample `PublicMediaUrl::reference('/storage/uploads/demo.webp')` → `http://localhost/storage/uploads/demo.webp`
- Files involved:
  - `backend/.env` (`APP_URL`)
  - `backend/config/filesystems.php`
  - `backend/app/Support/PublicMediaUrl.php`
  - `src/utils/mediaUrl.ts` (mitigation only when relative path present)
- Reproduction steps:
  1. Run `php artisan config:show filesystems` → public URL `http://localhost/storage`
  2. Resolve a storage path via `PublicMediaUrl`
  3. Request `http://localhost/storage/uploads/demo.webp` → **404** (XAMPP)
  4. Request same path on `http://127.0.0.1:8000/storage/...` → handled by Laravel (403 for missing file, not XAMPP 404)
- Expected result: Absolute media URLs use API origin `http://127.0.0.1:8000`
- Actual result: Absolute media URLs use `http://localhost` (Apache/XAMPP docroot)
- Evidence:
  - Console: n/a
  - Network: `http://localhost/storage/uploads/demo.webp` → 404; `http://127.0.0.1:8000/storage/uploads/demo.webp` → 403 for missing object
  - Laravel log: n/a for this config issue
  - Database/API comparison: seeded rows currently use `/assets/...` (relative), so site looks fine until uploads
- Root cause: Local `APP_URL` set to `http://localhost` instead of `http://127.0.0.1:8000` (or equivalent artisan serve origin)
- Recommended fix: Set `APP_URL=http://127.0.0.1:8000`, clear config cache, re-verify upload URLs; keep frontend `mediaUrl` rewrite as safety net
- Dependencies: Deploy/env parity for production API host
- Estimated risk: Low (config change); High if ignored before enabling uploads in prod-like envs

---

## 8. High-Priority Issues

### ISSUE-002 — Service detail routes are placeholders while Search/SEO promote them

- Severity: High
- Status: Confirmed
- Area: Public Website / API
- Route or page: `/services/:slug` (e.g. `/services/design-solutions`)
- Related record: Service “Design Solutions”
- Files involved:
  - `src/App.jsx`
  - `src/pages/PlaceholderPage.jsx`
  - `backend/app/Services/PublicSearchService.php`
  - SEO registry paths for services
  - `src/utils/contentMappers.js` (`mapService.path`)
- Reproduction steps:
  1. Open `/search?q=design%20solutions`
  2. Click result “Design Solutions”
  3. Land on Coming Soon placeholder
- Expected result: Real service detail page (or search should not deep-link)
- Actual result: Placeholder “This page is under development”
- Evidence:
  - Browser title/H1: “Services / Design Solutions”
  - API: `GET /api/public/search?q=design+solutions` returns `path: "/services/design-solutions"`
  - No public `services/{slug}` show route in `api.php`
- Root cause: Service detail feature unfinished; list/search/SEO assume detail routes exist
- Recommended fix: Either implement service detail page + public show endpoint, or remove/rewrite search/SEO paths to `/#services` or home services section
- Dependencies: Content design decision for service pages
- Estimated risk: Medium

### ISSUE-003 — Published project with empty slug and double-slash media paths breaks images

- Severity: High
- Status: Confirmed
- Area: Database / Media / Public Website
- Route or page: `/projects` (category image rotation)
- Related record: Project title `885`, id `16cb2435-53b5-42b1-9f77-9069c98e5592`, `status=published`, `slug=''`, `cover_image=/assets/projects//cover.webp`
- Files involved: projects table; category rotating image util `src/utils/categoryProjectImages.js`
- Reproduction steps:
  1. Load `/projects`
  2. Inspect images → one broken `http://127.0.0.1:5173/assets/projects//cover.webp`
  3. Confirm HTTP returns `200 text/html` (SPA fallback), naturalWidth 0
- Expected result: Valid slug + existing asset path, or record unpublished
- Actual result: Broken image in UI; project also cannot resolve via `/projects/:category/:project`
- Evidence:
  - DB row confirmed
  - Browser DOM broken image count ≥1 on `/projects`
  - Disk check: `public/assets/projects/cover.webp` missing; 7 related `//` gallery paths missing
- Root cause: Invalid content data (empty slug) entered/saved without adequate validation preventing publish
- Recommended fix: Quarantine/unpublish/fix record; harden slug validation (`required`, unique, non-empty); reject malformed media paths
- Dependencies: Admin project validation (`StoreProjectRequest` / `UpdateProjectRequest`)
- Estimated risk: Low–Medium (data cleanup)

### ISSUE-004 — Privacy/Terms pages exist but are not linked in site chrome

- Severity: High
- Status: Confirmed
- Area: Public Website / CMS content
- Route or page: `/privacy-policy`, `/terms-and-conditions`
- Related record: `legal_pages` (2 rows); `navigation_footer_settings.footerQuickLinks` currently `[]`
- Files involved:
  - `src/components/Footer/Footer.jsx` (`EXCLUDED_PATHS` includes `/privacy-policy`, `/terms`)
  - Navigation Footer CMS data
- Reproduction steps:
  1. Open any public page footer
  2. Observe no Privacy/Terms links
  3. Direct navigation to `/privacy-policy` works
- Expected result: Legal pages discoverable from footer
- Actual result: Only reachable by known URL
- Evidence:
  - API `footerNavGroups` has Get Started + About Us only; `footerQuickLinks` empty
  - Footer code actively filters privacy/terms paths
- Root cause: Content not present in footer CMS groups **and** frontend exclusion set
- Recommended fix: Add legal links to footer CMS; remove/adjust `EXCLUDED_PATHS`; align `/terms` vs `/terms-and-conditions`
- Dependencies: Legal/compliance requirements
- Estimated risk: Low

---

## 9. Medium-Priority Issues

### ISSUE-005 — Admin `published` form field does not persist

- Severity: Medium
- Status: Confirmed (code-evident; consistent with API resources)
- Area: Admin
- Route or page: Project/Category/Activity edit drawers
- Related record: N/A
- Files involved:
  - `src/modules/admin/cms/action-flows/moduleFormSchemas.js`
  - `src/modules/admin/cms/action-flows/mapItemToForm.js`
  - `src/modules/admin/cms/action-flows/mapFormValuesToApi.js`
  - Backend resources derive `published` from `status`
- Reproduction steps:
  1. Open project edit form
  2. Toggle “Published” independently of status (if UI allows)
  3. Save — API payload has no `published` key
- Expected result: One clear publish control that maps to `status`
- Actual result: Dual fields; only `status` is saved
- Evidence: `mapFormValuesToApi` omits `published`; `ProjectResource` sets `published` from `status === 'published'`
- Root cause: UI/schema drift vs API contract
- Recommended fix: Remove redundant field or map it to `status`
- Dependencies: Editor training/docs
- Estimated risk: Low

### ISSUE-006 — Unknown `/about/:section` shows Coming Soon instead of 404

- Severity: Medium
- Status: Confirmed
- Area: Public Website / Routing
- Route or page: `/about/unknown-xyz`
- Files involved: `src/App.jsx`, `PlaceholderPage.jsx`
- Reproduction steps: Visit `/about/unknown-xyz` → Coming Soon (HTTP 200 SPA)
- Expected result: NotFound page
- Actual result: Placeholder
- Evidence: Browser render + route order places catch-all before true 404
- Root cause: Intentional incomplete-route pattern over-broadly applied
- Recommended fix: Restrict to known unfinished sections or remove catch-all
- Dependencies: None
- Estimated risk: Low

### ISSUE-007 — Leftover temporary audit team members appear on public team page

- Severity: Medium
- Status: Confirmed
- Area: Database / Public Website
- Route or page: `/about/team-members`
- Related record: two `team_members` named `Phase7 Audit Member`, `photo=null`, `status=active`
- Files involved: `team_members` table; public team listing
- Reproduction steps: Public team API returns 23 members including 2 audit rows without photos
- Expected result: Only real team profiles
- Actual result: Audit leftovers published
- Evidence: DB query + admin API list (`per_page` full) shows 2 audit members
- Root cause: Previous audit/temp data not removed
- Recommended fix: Deactivate/delete those rows (after stakeholder confirm)
- Dependencies: Content owner approval
- Estimated risk: Low

### ISSUE-008 — Vite returns `200 text/html` for missing `/assets/...` paths

- Severity: Medium
- Status: Confirmed
- Area: Media / Frontend tooling
- Route or page: Any missing asset under `public/assets`
- Evidence: `GET /assets/projects//cover.webp` → 200 `text/html` (index shell), image naturalWidth 0
- Root cause: SPA fallback; broken URLs look like “successful” network responses
- Recommended fix: Configure Vite/static hosting to 404 missing assets; validate media paths server-side
- Dependencies: Deploy static hosting rules
- Estimated risk: Low

### ISSUE-009 — Generic placeholder social URLs in footer/connect

- Severity: Medium
- Status: Confirmed
- Area: Public Website / CMS
- Route or page: Footer social icons
- Related record: navigation/connect social links → `https://facebook.com`, `https://instagram.com`, `https://linkedin.com`
- Evidence: Browser link audit on home/search pages
- Root cause: Seed/CMS placeholders never replaced with real profiles
- Recommended fix: Update CMS social URLs or disable icons until real URLs exist
- Dependencies: Marketing accounts
- Estimated risk: Low

### ISSUE-010 — Frontend TypeScript lint fails on unit test files

- Severity: Medium
- Status: Confirmed
- Area: Build tooling
- Files involved:
  - `src/utils/categoryProjectImages.test.ts` (`categorySlug` unknown option)
  - `src/utils/teamMemberGroups.test.ts` (implicit `any`)
- Evidence: `npm run lint` exit code 2
- Root cause: Tests out of sync with util typings
- Recommended fix: Align test types/options; keep Vitest green (already passing runtime)
- Dependencies: None
- Estimated risk: Low

### ISSUE-011 — Home service cards are not clickable while search links to service placeholders

- Severity: Medium
- Status: Confirmed
- Area: Public Website
- Files involved: `src/components/Services/Services.jsx` (article only), search mapper paths
- Evidence: Home cards have no `Link`; search result links to `/services/...`
- Root cause: Incomplete IA for services
- Recommended fix: Same as ISSUE-002; make behavior consistent
- Dependencies: ISSUE-002
- Estimated risk: Low

---

## 10. Low-Priority Issues

### ISSUE-012 — Careers UI id vs jobs permission/API naming dualism

- Severity: Low
- Status: Confirmed (currently mitigated by alias)
- Area: Admin / Authentication
- Files involved: `adminNavigation.js`, `CmsModules.php`, `useModulePermissions.js`
- Evidence: Content Manager received **403** on `/api/admin/jobs` while projects **200** — expected by role; alias works for Super Admin nav
- Root cause: Intentional rename without full vocabulary unification
- Recommended fix: Document mapping; avoid checking `permissions.careers` without resolver
- Dependencies: None
- Estimated risk: Low (fragile for future code)

### ISSUE-013 — Category title typo “Govermental”

- Severity: Low
- Status: Confirmed
- Area: Content
- Route or page: `/projects` category card
- Evidence: Browser text “Govermental”
- Root cause: Content spelling error (`Governmental`)
- Recommended fix: Rename in Project Categories CMS
- Estimated risk: None

### ISSUE-014 — Pint style check fails across many PHP files

- Severity: Low
- Status: Confirmed
- Area: Backend tooling
- Evidence: `pint --test` JSON fail list (resources/controllers/tests)
- Root cause: Style drift vs Laravel Pint rules
- Recommended fix: Run pint in a dedicated cleanup PR
- Estimated risk: Low

### ISSUE-015 — Large JS bundle warning on production build

- Severity: Low
- Status: Confirmed
- Area: Frontend build
- Evidence: Vite warning chunk >500kB (`index-*.js` ~947kB)
- Root cause: Single bundle includes public + admin
- Recommended fix: Route-based code splitting (later)
- Estimated risk: Low

### ISSUE-016 — Connect page not linked in primary nav/footer groups

- Severity: Low
- Status: Probable (may be intentional)
- Area: Public Website
- Route or page: `/connect` works; not in `footerNavGroups` / main nav
- Recommended fix: Confirm product intent; link from Reach Out or footer if desired
- Estimated risk: Low

---

## 11. Broken Images and Media

### Broken Media Table (verified)

| Page/module | Record | Database path | API value | Final URL | HTTP status | Root cause |
|---|---|---|---|---|---|---|
| Projects page rotation | Project `885` | `/assets/projects//cover.webp` | same path/url object | `http://127.0.0.1:5173/assets/projects//cover.webp` | 200 `text/html` (broken img) | Empty slug + bad path; SPA fallback |
| Projects gallery (same record) | `885` gallery 01–06 | `/assets/projects//gallery-0N.webp` | same | Vite asset URL | missing on disk / HTML fallback | Corrupt paths |
| Storage absolute (config) | N/A demo | `/storage/uploads/demo.webp` | `http://localhost/storage/uploads/demo.webp` | localhost XAMPP | 404 | ISSUE-001 APP_URL |
| Seeded `/assets/*` (typical) | e.g. Himmeh Resort | `/assets/projects/himmeh-resort/cover.webp` | relative path/url | `http://127.0.0.1:5173/assets/...` | 200 image/webp | Working |
| Logo/poster/video root assets | home/nav | `/odeh-logo2.png`, `/hero-poster.jpg`, `/video-slider.mp4` | relative | Vite origin | 200 | Working on FE; would 404 if forced onto API host |

### Totals (this audit)

| Metric | Count |
|---|---|
| Media records/paths inspected (API disk check of assets) | 318 |
| Working on disk | 311 |
| Missing from disk | 7 (all from empty-slug project `//` paths) |
| Malformed URLs (`//` or empty slug) | 7+ |
| Storage-like DB paths currently | 0 (all seeded content is `/assets`) |
| Config-broken storage absolute pattern | Confirmed via PublicMediaUrl sample |
| No fallback / broken in browser on `/projects` | ≥1 observed |

**Note:** An earlier automated HEAD crawl reported hundreds of “broken” assets because it incorrectly requested `/assets/...` against the API host (`:8000`). Re-verified with GET against the frontend origin; seeded assets are present.

---

## 12. Broken Buttons and Interactions

| Page | Control | Expected behaviour | Actual behaviour | Console/network evidence | Root cause |
|---|---|---|---|---|---|
| Search results | Service result link | Open service detail | Opens Coming Soon | Navigation to `/services/design-solutions` | ISSUE-002 |
| Home services | Service card | (ambiguous) view details | Not clickable | No anchor in `Services.jsx` | Incomplete feature / ISSUE-011 |
| Footer | Privacy/Terms | Navigate to legal pages | Controls absent | API footer groups lack links; exclusion set | ISSUE-004 |
| Admin login | Sign in | Authenticate + dashboard | Works | Landed `/admin/dashboard` as Super Admin | OK |
| Admin sidebar | All module links | Open modules | Present for Super Admin including Team Categories | DOM nav list captured | OK |
| Admin careers action `view-applications` | Open applications filtered | Works via page interceptor | Empty `break` in shared action flow but CareersPage handles navigation | Code review | Residual stub only |
| Social icons | Open company profiles | Real profile pages | Generic `facebook.com` etc. | Link href audit | ISSUE-009 |

Full interactive CRUD click-through for every module button was **not** exhaustively browser-automated; backend Feature tests cover persistence for major modules (see §14 / §21).

---

## 13. Missing, Hidden or Disconnected Pages

| Classification | Exact case | Evidence | Root cause | Recommended correction |
|---|---|---|---|---|
| Route exists, page is placeholder | `/services/:slug` → `PlaceholderPage` | Browser + `App.jsx` | Unfinished feature | Build page or stop linking |
| Route exists, page is placeholder | `/about/:section` catch-all | `/about/unknown-xyz` | Over-broad catch-all | Use NotFound |
| Public page exists, not in navigation | `/privacy-policy`, `/terms-and-conditions` | Footer API + Footer.jsx | CMS + exclusion | Add links; fix exclusion |
| Public page exists, weak discovery | `/connect` | Not in nav groups | Possible intentional | Confirm IA |
| Admin API exists, no dedicated public consumer list endpoint | `admin/team-categories` | No `/api/public/team-categories` | Design: nested on members | Optional public endpoint if empty categories must show |
| Content in dashboard/public mismatch | Closed job in admin (6) vs public (5) | DB statuses open=5, closed=1 | Intentional public filter | Document as expected |
| Content incorrectly public | Phase7 Audit Members | DB + public team count 23 | Leftover temp data | Remove/deactivate |
| SEO/search points to missing real page | Service SEO/search paths | Search API path | ISSUE-002 | Align registry |

No case found of “dashboard page exists but sidebar missing” for registered CMS modules under Super Admin.

---

## 14. CRUD Audit Matrix

Legend: Pass / Partial / Fail / Not implemented / Blocked

| Module | List | Create | Read | Update | Delete | Validation | Media | Public output |
|---|---|---|---|---|---|---|---|---|
| Projects | Pass | Pass (tests) | Pass | Pass (tests) | Pass (tests) | Partial (empty slug published) | Partial (assets OK; storage URL risk) | Pass (except corrupt record) |
| Project Categories | Pass | Pass (tests) | Pass | Pass | Pass | Pass | Pass (fallback covers) | Pass |
| Services | Pass | Pass (tests) | Pass | Pass | Pass | Pass | Pass | Partial (no detail page) |
| Activities | Pass | Pass (tests) | Pass | Pass | Pass | Pass | Pass | Pass |
| Team Categories | Pass | Pass (tests) | Pass | Pass | Pass | Pass | N/A | Indirect via members |
| Team Members | Pass | Pass (tests) | Pass | Pass | Pass | Pass | Partial (null photos on audit rows) | Pass |
| Jobs/Careers | Pass | Pass (tests) | Pass | Pass | Pass | Pass | N/A | Pass (open only) |
| Applications | Pass | N/A (public create) | Pass | Pass (tests) | N/A | Pass | CV private disk (tests) | N/A |
| Contact Messages | Pass | N/A (public create) | Pass | Pass (status tests) | N/A | Pass | N/A | N/A |
| Home/About/Nav/Connect/Settings | Pass | N/A | Pass | Pass (singleton tests) | N/A | Pass | Depends on APP_URL for uploads | Pass |
| Legal Pages | Pass | Not implemented (by design) | Pass | Pass | Not implemented | Pass | N/A | Pass (direct URL) |
| SEO | Pass | Auto on content create (tests) | Pass | Pass | Auto on delete (tests) | Pass | N/A | Indirect |
| Users & Roles | Pass | Pass (live probe + tests) | Pass | Pass | Pass (temp user deleted) | Pass | N/A | N/A |

---

## 15. Database/API/UI Reconciliation

| Entity | DB total | DB active/published | Admin API | Public API | Dashboard visible | Website visible | Difference |
|---|---|---|---|---|---|---|---|
| Services | 7 | 7 published | 7 | 7 | 7 (stats) | 7 on home | None; detail pages missing |
| Project categories | 11 | 11 published | 11 | 11 | 11 | 11 | None |
| Projects | 49 | 49 published | 49 | 49 | 49 | 49 (incl. bad row effects) | 1 corrupt slug row |
| Activities | 4 | 4 published | 4 | 4 | 4 | 4 | None |
| Team categories | 9 | 9 active | 9 | nested only | 9 | only categories with members | Expected |
| Team members | 23 | 23 active | 23 | 23 | 23 | 23 | Includes 2 audit leftovers |
| Job postings | 6 | 5 open / 1 closed | 6 | 5 | 6 | 5 | Intentional status filter |
| Job applications | 1 | 1 new | 1 | N/A | 1 | N/A | None |
| Contact messages | 1 | resolved | 1 | N/A | 1 | N/A | None |
| Legal pages | 2 | 2 | 2 | 2 | 2 | 2 via direct URL | Nav discovery gap |
| SEO pages | 90 | 90 | 90 | 90 | 90 | meta by route | None |
| Users | 1 | 1 | 1 | N/A | 1 | N/A | Only super admin seeded |
| Roles | 5 | 5 | 5 | N/A | 5 | N/A | None |
| CMS singletons (home/about/nav/connect/settings) | 1 each | — | OK | OK | OK | OK | None |

**Important:** Laravel queue table is also named `jobs`; career data lives in **`job_postings`**.

---

## 16. Public API Audit

| Method | Endpoint | Consumer page | Status | Schema match | Data correct | Issues |
|---|---|---|---|---|---|---|
| GET | `/public/home` | Home | 200 | Yes | Yes | |
| GET | `/public/about` | About pages | 200 | Yes | Yes | |
| GET | `/public/navigation-footer` | Nav/Footer | 200 | Yes | Yes | No legal links |
| GET | `/public/connect` | Connect | 200 | Yes | Yes | |
| GET | `/public/website-settings` | Global | 200 | Yes | Yes | |
| GET | `/public/reach-out` | Reach Out | 200 | Yes | Yes | |
| GET | `/public/legal-pages` | Legal | 200 | Yes | Yes | |
| GET | `/public/legal-pages/{slug}` | Legal detail | 200/404 | Yes | Yes | invalid → 404 JSON |
| GET | `/public/seo` | SEO | 200 | Yes | Yes | |
| GET | `/public/seo/by-route` | Pages | 200 | Yes | Yes | |
| GET | `/public/project-categories` | Projects | 200 | Yes | Yes | |
| GET | `/public/projects` | Projects | 200 | Yes (`page/categories/projects`) | Yes | includes corrupt project |
| GET | `/public/projects/{cat}/{slug}` | Detail | 200/404 | Yes | Yes | |
| GET | `/public/services` | Home | 200 | Yes | Yes | no show route |
| GET | `/public/activities` | Activities | 200 | Yes | Yes | |
| GET | `/public/activities/{slug}` | Detail | 200/404 | Yes | Yes | |
| GET | `/public/team-members` | Team | 200 | Yes | Yes | includes audit rows |
| GET | `/public/careers` | Careers | 200 | Yes | Yes | |
| GET | `/public/jobs` | Careers | 200 | Yes | Yes | open only |
| GET | `/public/jobs/{slug}` | Job detail | 200/404 | Yes | Yes | |
| GET | `/public/search` | Search | 200 | Yes | Yes | service paths → placeholders |
| GET | `/public/search/suggestions` | Search UI | 200 | Yes | Yes | |
| POST | `/public/contact` | Reach Out | tested via PHPUnit | Yes | Yes | not re-submitted in browser this run |
| POST | `/public/jobs/{slug}/applications` | Apply | tested via PHPUnit | Yes | Yes | not re-submitted in browser this run |

No public endpoint returned Laravel HTML error pages during this run.

---

## 17. Admin API Audit

| Check | Result |
|---|---|
| Auth required | Confirmed `401` without token |
| Super Admin access | All sampled GETs `200` |
| Content Manager access | projects `200`; users/seo/jobs `403` |
| Invalid login | `422` |
| Valid login | `200` with `data.token` |
| Uploads endpoint | Exists `POST /admin/uploads/image` (covered by ImageUploadTest) |
| Legal create/delete | Not routed (confirmed by tests) |
| Naming | Frontend `careers` ↔ API `jobs` |

Frontend consumers exist for all major admin modules listed in §6. No nonexistent endpoint calls were observed in the sampled modules during API probing.

---

## 18. Authentication and Permissions

| Scenario | Result |
|---|---|
| Super Admin login | Pass → dashboard |
| Invalid login | Pass → 422 |
| Unauthenticated admin API | Pass → 401 |
| Session/token persistence | Pass in-browser after login |
| Direct `/admin/dashboard` after auth | Pass |
| Content Manager restricted API | Pass (403 on users/seo/jobs) |
| Super Admin bypass | Pass (all modules visible) |
| Temp restricted user cleanup | Pass (created 201, deleted 204) |

**Missing dashboard pages are not caused by permission filtering for Super Admin.**  
Restricted role correctly hides/denies modules.

Credentials used for local testing were seed defaults; **not reproduced in this report**.

---

## 19. Console, Network and Laravel Errors

### Browser / Network (current)

- Public content APIs generally 200.
- Broken image: `/assets/projects//cover.webp` (HTML fallback).
- Search → service placeholder navigation confirmed.
- No CORS failures observed between `127.0.0.1:5173` and `:8000` during this audit.

### Laravel logs

- Historical (2026-07-12): multiple `Attempt to read property "value" on null` in Resources when `status` enum null — **not reproduced** against current published dataset; code still uses `$this->status->value` (fragile if null status inserted).
- 2026-07-27: parse errors from a failed `tinker --execute` attempt during audit tooling (operator error; not an app runtime defect).
- No fresh reproducible 500s from public/admin GETs in this session.

---

## 20. Responsive Issues

Tested via device metrics override (375×812) and desktop screenshots.

| Viewport | Observation | Severity |
|---|---|---|
| ~375px | Home exposes `Open menu` hamburger; main nav collapses | Expected / OK |
| ~375px | Search hero readable; results may require scroll (screenshot timing showed empty area once during navigation race) | Probable UX — re-check after hard reload |
| Desktop 1440-class | Projects/home/admin login layouts render | OK |
| Not fully lab-tested | 320 / 768 / 1024 physical devices, touch targets, table overflow in every admin grid | Items Not Verifiable |

No confirmed horizontal overflow crash was captured; deeper responsive pass remains recommended.

---

## 21. Build, Test and Static Analysis Results

| Command | Result | Tests | Failures | Important warnings |
|---|---|---|---|---|
| `npm run test` | Pass | 11 | 0 | — |
| `npm run build` | Pass | — | 0 | chunk >500kB |
| `npm run lint` | Fail | — | 5 TS errors | test typing drift |
| `php artisan test` | Pass | 123 | 0 | — |
| `pint --test` | Fail | — | many style files | non-blocking functionally |
| `phpstan` | Skipped | — | — | not installed |

---

## 22. Root-Cause Summary

1. **Environment misconfiguration (`APP_URL`)** makes storage media absolute URLs point at the wrong HTTP host — primary root cause for “uploads break / some images fail after CMS changes”.
2. **Unfinished service detail product surface** leaves routes as placeholders while search/SEO still advertise them.
3. **Dirty/invalid content rows** (empty slug project; leftover audit team members) create visible public defects despite healthy APIs.
4. **Navigation/CMS content gaps + Footer exclusion logic** hide legal pages.
5. **Admin form mapping drift** (`published` vs `status`) creates false confidence that toggles save.
6. **SPA asset fallback** converts missing image URLs into `200 HTML`, complicating diagnosis.

---

## 23. Recommended Fix Plan

### Phase A — Critical Stability
- Fix `APP_URL` / public disk URL to API origin; verify `storage:link`; smoke-test upload.
- Guard Resource enum access against null status.
- Issue IDs: **001** (+ historical null-status hardening)

### Phase B — API and Data Consistency
- Unpublish/fix/delete corrupt project `885` and Phase7 audit members.
- Strengthen slug/media path validation.
- Issue IDs: **003**, **007**

### Phase C — Media Reliability
- Ensure upload responses always include usable relative `path`.
- Configure static hosting to 404 missing assets.
- Issue IDs: **001**, **008**

### Phase D — Admin CRUD
- Remove or wire `published` field; QA publish/unpublish flows.
- Confirm careers↔jobs permission alias coverage in all new code.
- Issue IDs: **005**, **012**

### Phase E — Public Website
- Implement or delink service detail pages; fix search/SEO paths.
- Restore Privacy/Terms footer links; decide Connect discovery.
- Replace placeholder social URLs; fix “Govermental” typo.
- Issue IDs: **002**, **004**, **009**, **011**, **013**, **016**

### Phase F — Responsive and UX Polish
- Mobile nav/search empty-state pass across 320–1440.
- Code-split admin/public bundles; fix `tsc` test typings; optional Pint cleanup.
- Issue IDs: **010**, **014**, **015**

---

## 24. Suggested Fix Order

1. **ISSUE-001** env/media host (unblocks uploads)
2. **ISSUE-003** + **ISSUE-007** data cleanup (immediate visible wins)
3. **ISSUE-002** + **ISSUE-011** service detail strategy
4. **ISSUE-004** legal footer links
5. **ISSUE-005** admin publish field
6. Remaining medium/low tooling and content polish

---

## 25. Files Likely Requiring Modification

- `backend/.env` / deployment env templates (APP_URL)
- `backend/app/Support/PublicMediaUrl.php`
- `backend/app/Http/Requests/Admin/*Project*`
- `backend/app/Services/PublicSearchService.php` (+ SEO registry service)
- `src/App.jsx`, `src/pages/PlaceholderPage.jsx`
- `src/components/Footer/Footer.jsx`
- `src/components/Services/Services.jsx`
- `src/modules/admin/cms/action-flows/mapFormValuesToApi.js`, `moduleFormSchemas.js`
- `src/utils/mediaUrl.ts` (already mitigates; keep tests green)
- `src/utils/*.test.ts` (lint failures)
- Navigation Footer CMS content (DB singleton)
- Project/team member content rows (DB)

---

## 26. Items Not Verifiable

| Item | Reason |
|---|---|
| Production/staging host (`dev.odeh-design.com`) parity | Audit ran against local `127.0.0.1` stack only |
| Exhaustive browser CRUD for every admin control (every filter/sort/bulk) | Timeboxed; compensated with PHPUnit Feature suite + selective UI/API probes |
| Job application + contact form live browser submit | Covered by PHPUnit; not re-submitted in browser to avoid extra PII noise |
| Real mobile devices / iOS Safari | Emulation only |
| Actual CMS image upload end-to-end in browser | Avoided mutating storage beyond probes; APP_URL defect already proven via URL generation |
| Email sending | `MAIL_MAILER=log` |
| Restricted role **sidebar** visual filtering in browser | API 403 confirmed; UI filter assumed via same permission hooks but not screenshot-verified for content-manager session |
| Google Maps embed runtime inside iframe | Embed URL present; HEAD to maps URL not a reliable availability signal |

---

## 27. Final Audit Statistics

| Metric | Count |
|---|---|
| Public routes discovered | 24 patterns |
| Public routes tested | 24 |
| Admin routes discovered | 19 page routes (+ login) |
| Admin routes tested | 19 shells + live Super Admin dashboard/nav |
| API endpoints tested | 18 public GET + 4 invalid-slug + 19 admin GET + auth cases + permission probe |
| CRUD modules reviewed | 18 |
| Images/media URLs tested | 318 disk + browser samples + storage config samples |
| Broken images found | 7 missing asset paths (+ 1+ visible broken img); storage host misconfig confirmed |
| Buttons/actions tested | 20+ critical (login, nav, search result, sidebar, permission APIs) |
| Broken actions found | 3 confirmed (service link, missing legal links, non-click home services) |
| Console errors found | 0 blocking React errors captured in evaluated pages |
| Network failures found | Storage localhost 404 pattern; placeholder navigations |
| Laravel errors reproduced (current) | 0 app 500s; historical null-status Resource errors noted |
| Missing/disconnected pages found | 5 classes (services placeholder, about catch-all, legal unlink, connect discovery, search→placeholder) |
| Critical issues | 1 |
| High issues | 3 |
| Medium issues | 7 |
| Low issues | 5 |
| Recommendations / probable | included in Low + §26 |

---

### Per-issue proposed fix cards (summary)

| Phase | Issue IDs | Expected files | DB impact | API impact | Risk | Verification |
|---|---|---|---|---|---|---|
| A | 001 | env, PublicMediaUrl, filesystems | none | media URL host | Low | Upload image; assert URL host `:8000` and 200 |
| B | 003,007 | admin validation, content rows | update/delete bad rows | list/detail exclude bad data | Low | `/projects` no broken img; team count sane |
| C | 001,008 | vite/static config, upload service | none | upload payload paths | Low | Missing asset returns 404 not HTML |
| D | 005,012 | mapFormValuesToApi, schemas, docs | none | status mapping | Low | Toggle publish persists after refresh |
| E | 002,004,009,011,013,016 | App routes/pages, Footer, Services, CMS content | footer/social/category text | search/SEO paths | Medium | Search service UX agreed; legal links visible |
| F | 010,014,015 | tests, pint, code split | none | none | Low | lint/build clean |

---

**Confirmation:** No broad fixes or redesign changes were made during this audit. Diagnostic scripts were written under `.tmp/audit/` only. A temporary restricted user was created and deleted (204). Git checkpoint tag: `audit-checkpoint-2026-07-27`.
