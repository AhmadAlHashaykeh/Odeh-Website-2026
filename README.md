# ODEH & PARTNERS Website 2026

**Frontend Administration CMS**

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6.28-CA4245?logo=react-router&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)
![CSS Modules](https://img.shields.io/badge/CSS_Modules-Scoped-1572B6?logo=css3&logoColor=white)
![Status](https://img.shields.io/badge/Frontend-Complete-success)
![Backend](https://img.shields.io/badge/Backend-Not_Integrated-lightgrey)

> Official frontend documentation for the **`frontend-admin-complete`** branch — the finalized frontend before backend integration.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Architecture](#project-architecture)
4. [Admin Modules](#admin-modules)
5. [Single Source of Truth](#single-source-of-truth)
6. [Current Frontend Features](#current-frontend-features)
7. [Current Limitations](#current-limitations)
8. [Backend Integration Notes](#backend-integration-notes)
9. [Folder Structure](#folder-structure)
10. [Development Philosophy](#development-philosophy)
11. [Future Backend Roadmap](#future-backend-roadmap)
12. [Getting Started](#getting-started)
13. [Branch Information](#branch-information)

---

## Project Overview

### Purpose of the Website

**ODEH & PARTNERS** is the public-facing website for an engineering and consulting firm. It presents the company's portfolio, services, team, company history, careers, and contact channels through a modern, editorial design. The public site is a single-page-application (SPA) built with React and served at routes such as `/`, `/projects`, `/about/overview`, `/careers`, and `/connect`.

### Purpose of the CMS

The **Admin CMS** (`/admin/*`) is a custom-built content management interface that allows administrators to manage every piece of website content — from portfolio projects and team profiles to homepage sections, navigation, legal documents, SEO metadata, and user permissions.

It is not a third-party CMS. It is purpose-built for this website's exact content model, navigation structure, and editorial workflow.

### Why a Custom CMS

A custom CMS was chosen because:

- **The website defines the content model** — not the other way around. Every admin module maps directly to a public page or content type already designed in the frontend.
- **No WordPress-style complexity** — no plugins, themes, or generic page builders. Each module is tailored to its content.
- **Single Source of Truth** — content is owned by exactly one module and referenced everywhere else. Nothing is duplicated.
- **Backend follows frontend** — the UI, routes, action flows, and data shapes are the contract. Backend integration replaces mock data with APIs; it does not redesign the interface.

### Single Source of Truth Philosophy

Every content type has **one owner module**. Other modules may *display* or *reference* that content, but they never duplicate or independently edit it.

Examples:

- **Projects** are owned by the Projects module. The Home Page shows a curated preview; it does not store project data.
- **SEO metadata** is owned exclusively by the SEO module. Content modules show a delegation notice instead of inline SEO fields.
- **Team Members** are owned by the Team Members module. About Pages shows read-only stats and a shortcut to the owner module.

This philosophy is enforced in the UI through `ManagedContentNotice` and `SeoDelegationNotice` components.

### Relationship Between Website and Admin

```
┌─────────────────────────────────────────────────────────────┐
│                     Single React SPA                        │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │   Public Website    │    │      Admin CMS (/admin)     │ │
│  │                     │    │                             │ │
│  │  src/pages/         │◄───│  src/modules/admin/         │ │
│  │  src/components/    │    │                             │ │
│  │  src/data/  ◄───────┼────┼── mock data transforms      │ │
│  │  (content source)   │    │  (future: API layer)        │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

- The **public website** reads content from `src/data/` (currently static JavaScript files).
- The **admin CMS** reads the same source files through mock data transformers, adding CMS-only fields (status, timestamps, display order, SEO flags).
- When backend integration begins, `src/data/` becomes the client-side cache; APIs replace mock files. The admin UI remains unchanged.

---

## Tech Stack

All technologies listed below are actively used in this project.

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | ^18.3.1 | UI rendering |
| **Build Tool** | Vite | ^5.4.11 | Dev server, HMR, production build |
| **Routing** | React Router DOM | ^6.28.0 | Client-side routing (public + admin) |
| **Language** | JavaScript (ES Modules) | ES2022 | Application logic |
| **Styling** | CSS Modules | — | Scoped component styles |
| **Design Tokens** | CSS Custom Properties | — | Admin design system (`admin-tokens.css`) |
| **Global Styles** | Plain CSS | — | Site-wide variables (`global.css`) |
| **Smooth Scroll** | Lenis | ^1.3.25 | Public site smooth scrolling |
| **State Management** | React Context API | — | Breadcrumbs, smooth scroll |
| **Local State** | React Hooks (`useState`, `useReducer`, custom hooks) | — | Module-level state |
| **Icons** | Custom SVG (`AdminIcons.jsx`) | — | Admin icon set |
| **Asset Pipeline** | Node.js + Python scripts | — | Image download, optimization, poster extraction |

### Intentionally Not Used

| Technology | Reason |
|-----------|--------|
| TypeScript | Project uses JavaScript with JSDoc where needed |
| Tailwind CSS | CSS Modules provide scoped, maintainable styles |
| Redux / Zustand | Context API + local hooks sufficient for current scope |
| React Query / SWR | No API layer yet; mock data served locally |
| UI Libraries (MUI, shadcn) | Custom admin design system built in-house |
| Test Frameworks | Not yet configured |
| ESLint / Prettier configs | Not yet configured in repository |

---

## Project Architecture

### High-Level Structure

```
Website (Single SPA)
│
├── Public Pages                    ← src/pages/, src/components/
│   ├── Home
│   ├── About (Overview, Approach, History, Team, Activities)
│   ├── Projects (Listing, Categories, Detail)
│   ├── Services
│   ├── Careers (Listing, Detail, Application)
│   ├── Connect
│   ├── Reach Out
│   ├── Search
│   ├── Legal (Privacy, Terms)
│   └── Thank You / 404
│
└── Admin CMS (/admin/*)            ← src/modules/admin/
    ├── Dashboard
    ├── Content
    │   ├── Projects
    │   ├── Project Categories
    │   ├── Services
    │   ├── Team Members
    │   └── Activities
    ├── Recruitment
    │   ├── Careers
    │   └── Applications
    ├── Communication
    │   └── Contact Messages
    ├── Website
    │   ├── Home Page
    │   ├── About Pages
    │   ├── Navigation & Footer
    │   ├── Connect Page
    │   └── Legal Pages
    └── Settings
        ├── SEO
        ├── Website Settings
        └── Users & Roles
```

### Admin Internal Architecture

```
src/modules/admin/
│
├── layout/          Admin shell (sidebar, top bar, breadcrumb slot)
├── routes/          Route definitions (AdminRoutes.jsx)
├── config/          Sidebar navigation configuration
├── context/         AdminBreadcrumbContext
│
├── ui/              Admin design system (Button, Modal, Drawer, Table, Form, Skeleton…)
├── cms/             Shared CMS framework
│   ├── layout/      CmsListingLayout (generic listing template)
│   ├── components/  Reusable CMS primitives (Toolbar, Filters, Pagination, EmptyState…)
│   ├── hooks/       useListingState, useAdminBreadcrumbs
│   └── action-flows/ CRUD interaction system (form drawers, gallery, confirm modals)
│
├── hooks/           Shared admin hooks (useActionFeedback, useSimulatedLoading)
├── utils/           clipboard, openExternalUrl, websiteContentStats
├── components/      AdminIcons (SVG icon set)
│
└── [feature modules]/   17 self-contained admin modules
    ├── pages/           Route page components
    ├── components/      Module-specific UI
    ├── hooks/           Module state & logic
    └── mock/            Mock data + configuration
```

### Module Patterns

The admin uses four distinct UI patterns:

| Pattern | Description | Used By |
|---------|-------------|---------|
| **A — Custom Listing** | Full listing page with toolbar, filters, table/card views, drawers, bulk actions | Projects, Categories, Team, Activities, Services, Careers, Applications, Contact Messages |
| **B — Section/Panel CMS Editor** | Section navigation + content panels + edit modals | Home Page, About Pages, Navigation & Footer, Connect Page, Legal Pages, Website Settings |
| **C — Workspace CMS** | Multi-panel workspace with module picker and inspector | SEO, Users & Roles |
| **D — Generic Listing Layout** | All-in-one listing template (dev/demo only) | `/admin/cms-preview` |

### Routing

**Public routes** are defined in `src/App.jsx`. Admin routes skip public-only features (BackToTop, Lenis smooth scroll).

**Admin routes** are defined in `src/modules/admin/routes/AdminRoutes.jsx`, nested under `AdminLayout`. The index route redirects to `/admin/dashboard`.

**Sidebar navigation** is configuration-driven via `src/modules/admin/config/adminNavigation.js`. Adding a new module requires extending this config and registering a route — no sidebar code changes needed.

### Shared CMS Framework (`cms/`)

The `cms/` folder provides reusable building blocks that feature modules compose:

| Component / Hook | Purpose |
|-----------------|----------|
| `CmsListingLayout` | Full-page listing template |
| `PageHeader` | Title, description, breadcrumbs, actions |
| `Toolbar` / `SearchField` / `FilterDropdown` | Search and filter controls |
| `ViewSwitcher` | Table ↔ Card/Grid toggle |
| `StatisticsStrip` | KPI statistics bar |
| `TableView` / `CardView` | Data display layouts |
| `SelectionToolbar` / `BulkActions` | Multi-select operations |
| `Pagination` | Page navigation |
| `EmptyState` / `SkeletonLoader` | Loading and empty states |
| `DeleteModal` / `StatusBadge` | Confirmations and status indicators |
| `ManagedContentNotice` | Redirects to content owner module |
| `SeoDelegationNotice` | Redirects SEO editing to SEO module |
| `useListingState` | Search, filter, sort, pagination, selection state |
| `useAdminActionFlows` | CRUD drawer/modal state machine |
| `AdminFormDrawer` | Schema-driven add/edit forms |
| `AdminGalleryDrawer` | Gallery management drawer |
| `ConfirmActionModal` | Destructive action confirmation |
| `ActionFeedback` | Success/info feedback banner |

### Admin UI System (`ui/`)

The admin design system lives in `src/modules/admin/ui/` and is documented in its own [README](src/modules/admin/ui/README.md).

| Component | Variants |
|-----------|----------|
| `Button` | primary, secondary, ghost, danger, accent; sm/md/lg; loading, iconOnly |
| `Input` | text, search, password, number; Textarea, Field |
| `Select` | default, Filter, Multi, Searchable |
| `Badge` | success, warning, error, info, draft, published, archived, featured, new, neutral |
| `Card` | standard, statistic, interactive, glass, panel, section |
| `Modal` | default, large; Confirmation, Actions |
| `Drawer` | default, large; Header, Footer; stickyHeader/Footer |
| `Table` | Compound: Wrap, Root, Head, Body, Row, HeaderCell, Cell, TitleCell |
| `Form` | Form, Section, Field, Row, Divider, Actions |
| `EmptyState` | default, featured |
| `Skeleton` | Stats, Toolbar, Table, Cards, Form, List, Loader |

Design tokens are scoped to `[data-admin-layout]` in `tokens/admin-tokens.css`.

---

## Admin Modules

All 17 admin modules are **UI-complete** with mock data, simulated loading, and preview-mode actions. No backend persistence exists yet.

### Dashboard

| Field | Value |
|-------|-------|
| **Route** | `/admin/dashboard` |
| **Purpose** | CMS overview with KPI cards, content summary, and quick actions |
| **Status** | Complete |
| **Source of Data** | `mock/dashboardData.js` + aggregated stats from `utils/websiteContentStats.js` |
| **Owner** | Dashboard (read-only aggregator — does not own content) |

### Content Group

| Module | Route | Purpose | Status | Source of Data | Owner |
|--------|-------|---------|--------|----------------|-------|
| **Projects** | `/admin/projects` | Manage architectural portfolio projects (CRUD UI, filters, bulk actions, gallery) | Complete | `mock/projectsData.js` ← `src/data/projectsContent.js` | **Projects Module** |
| **Project Categories** | `/admin/project-categories` | Manage project category groupings and linked projects | Complete | `mock/categoriesData.js` ← `src/data/projectsContent.js` | **Categories Module** |
| **Services** | `/admin/services` | Manage service offerings and homepage visibility flags | Complete | `mock/servicesData.js` ← `src/data/services.js` | **Services Module** |
| **Team Members** | `/admin/team-members` | Manage team member profiles (name, role, bio, photo) | Complete | `mock/teamMembersData.js` ← `src/data/teamContent.js` | **Team Members Module** |
| **Activities** | `/admin/activities` | Manage company activities displayed on About pages | Complete | `mock/activitiesData.js` ← `src/data/activitiesContent.js` | **Activities Module** |

### Recruitment Group

| Module | Route | Purpose | Status | Source of Data | Owner |
|--------|-------|---------|--------|----------------|-------|
| **Careers** | `/admin/careers` | Manage job postings (title, department, description, status) | Complete | `mock/careersData.js` ← `src/data/careers.js` | **Careers Module** |
| **Applications** | `/admin/applications` | Review candidate job applications linked to career listings | Complete | `mock/applicationsData.js` (generated from job records) | **Applications Module** (inbound data — not editable content) |

### Communication Group

| Module | Route | Purpose | Status | Source of Data | Owner |
|--------|-------|---------|--------|----------------|-------|
| **Contact Messages** | `/admin/contact-messages` | Manage Reach Out / contact form submissions | Complete | `mock/contactMessagesData.js` (28 sample messages) | **Contact Messages Module** (inbound data — not editable content) |

### Website Group

| Module | Route | Purpose | Status | Source of Data | Owner |
|--------|-------|---------|--------|----------------|-------|
| **Home Page** | `/admin/home-page` | Edit homepage sections (hero, about preview, services preview, projects preview) | Complete | `mock/homePageData.js` | **Home Page Module** (section framing only — referenced content owned elsewhere) |
| **About Pages** | `/admin/about-pages` | Edit About Overview, Approach, History content panels | Complete | `mock/aboutPagesData.js` ← `src/data/overviewContent.js`, `approachContent.js`, `historyContent.js` | **About Pages Module** (page content only — team/activities are read-only references) |
| **Navigation & Footer** | `/admin/navigation-footer` | Edit main navigation links, footer groups, contact block, social links | Complete | `mock/navigationFooterData.js` ← `src/data/navigation.js` | **Navigation & Footer Module** |
| **Connect Page** | `/admin/connect-page` | Edit Connect page hero and link cards | Complete | `mock/connectPageData.js` ← `src/data/connectLinks.js` | **Connect Page Module** |
| **Legal Pages** | `/admin/legal-pages` | Edit Privacy Policy and Terms & Conditions documents | Complete | `mock/legalPagesData.js` ← `src/data/privacyPolicyContent.js`, `termsContent.js` | **Legal Pages Module** |

### Settings Group

| Module | Route | Purpose | Status | Source of Data | Owner |
|--------|-------|---------|--------|----------------|-------|
| **SEO** | `/admin/seo` | Manage SEO metadata for all public pages; AI optimization UI (mock) | Complete | `mock/buildSeoPages.js` (auto-generated from all public routes) | **SEO Module** |
| **Website Settings** | `/admin/website-settings` | Global settings: general, branding, contact, localization, search, integrations | Complete | `mock/websiteSettingsData.js` | **Website Settings Module** |
| **Users & Roles** | `/admin/users-roles` | Admin user management, role definitions, permissions matrix | Complete | `mock/usersRolesData.js` (6 roles, permission matrix for 18 modules) | **Users & Roles Module** |

### Dev-Only Route

| Route | Purpose |
|-------|---------|
| `/admin/cms-preview` | Demonstrates the generic `CmsListingLayout` framework with demo data. Not listed in sidebar. |

---

## Single Source of Truth

Content ownership is enforced at the architecture level. The table below defines who owns each content type and where it is consumed.

### Content Types

| Content Type | Owner Module | Used In | Rule |
|-------------|-------------|---------|------|
| **Projects** | Projects | Home Page (preview), Categories (grouping), Project detail pages | Never duplicated. Home Page selects featured projects; Categories groups them. |
| **Project Categories** | Project Categories | Projects (filter/group), Projects public pages | Categories define groupings; projects reference a category. |
| **Services** | Services | Home Page (carousel preview), Services public pages | Home Page shows selected services; does not store service data. |
| **Team Members** | Team Members | About Pages (read-only stats), About Team public page | About Pages shows a `ManagedContentNotice` with stats and a shortcut. |
| **Activities** | Activities | About Pages (read-only stats), About Activities public pages | About Pages shows a `ManagedContentNotice` with stats and a shortcut. |
| **Careers / Jobs** | Careers | Applications (linked), Careers public pages | Applications are inbound submissions linked to job records. |
| **Applications** | Applications | — (inbound only) | Read/manage workflow. Not editable website content. |
| **Contact Messages** | Contact Messages | — (inbound only) | Read/manage workflow. Not editable website content. |
| **Home Page Sections** | Home Page | Public homepage (`/`) | Owns section framing (headlines, CTAs, layout). Referenced content owned by other modules. |
| **About Page Content** | About Pages | About Overview, Approach, History public pages | Owns page-specific content (hero, intro, gallery, principles, timeline). |
| **Navigation & Footer** | Navigation & Footer | All public pages (Navbar, Footer components) | Single source for all nav links, footer groups, contact info, social links. |
| **Connect Page** | Connect Page | Connect public page (`/connect`) | Owns hero and link cards exclusively. |
| **Legal Documents** | Legal Pages | Privacy Policy, Terms & Conditions public pages | Owns full document content. |
| **SEO Metadata** | SEO | All public pages (via `usePageMeta`) | Meta title, description, OG tags managed exclusively in SEO module. Content modules show `SeoDelegationNotice`. |
| **Website Settings** | Website Settings | Global (site name, branding, contact defaults) | Global configuration not tied to a specific page. |
| **Users & Roles** | Users & Roles | Admin access control | Permission matrix covers all 18 admin modules. |

### Enforcement Mechanisms

1. **`ManagedContentNotice`** — Displayed in About Pages for Team Members and Activities sections. Shows read-only stats and a shortcut link to the owner module.
2. **`SeoDelegationNotice`** — Displayed in content module form drawers. Redirects SEO editing to the SEO module with a status badge (Complete / Pending).
3. **`CmsModuleShortcut`** — Used in Home Page section definitions to link to the owner module (e.g., "Open About Pages", "Manage Services").
4. **Form Schemas** — `moduleFormSchemas.js` defines fields per module. SEO fields are excluded from content module schemas.

---

## Current Frontend Features

Everything listed below is implemented and functional in the UI (preview mode).

### Public Website

| Feature | Details |
|---------|---------|
| **Responsive Layout** | Mobile-first design across all public pages |
| **Smooth Scroll** | Lenis-powered smooth scrolling (disabled in admin) |
| **Hero Video** | Full-viewport video background with poster fallback |
| **Scroll Reveal Animations** | Intersection Observer-based reveal effects |
| **Animated Counters** | Count-up animations for statistics |
| **Image Gallery / Lightbox** | Project and activity gallery with lightbox |
| **Site Search** | Full-text search with overlay UI and results page |
| **Job Application Flow** | Multi-step application form with thank-you page |
| **SEO Meta Tags** | Dynamic title and description via `usePageMeta` |
| **404 Page** | Custom not-found page |
| **Back to Top** | Scroll-to-top button (public pages only) |

### Admin CMS — Listing Modules

| Feature | Details |
|---------|---------|
| **Statistics Strip** | KPI bar at top of every listing page |
| **Search** | Real-time text search across listing data |
| **Filters** | Status, category, department, priority, date, featured, published filters |
| **Sort** | Configurable sort options per module |
| **View Switcher** | Toggle between Table and Card/Grid/Editorial views |
| **Pagination** | Page-based navigation for large datasets |
| **Row Selection** | Checkbox selection for bulk operations |
| **Bulk Actions** | Publish, archive, delete, export (UI only) |
| **Details Drawer** | Slide-out panel with full item details |
| **Quick Actions** | Inline row actions (view, edit, delete, preview) |
| **Empty States** | Contextual empty state with call-to-action |
| **Loading Skeletons** | Simulated loading with skeleton placeholders (~480ms) |
| **Delete Confirmation** | Modal confirmation for destructive actions |
| **Action Feedback** | Auto-dismiss success/info banner (3.2s) |
| **External Preview** | Opens public page URL in new tab |
| **Breadcrumbs** | Dynamic breadcrumb trail in admin top bar |

### Admin CMS — Editor Modules

| Feature | Details |
|---------|---------|
| **Section Navigation** | Side nav for multi-section CMS pages |
| **Content Panels** | Structured panels with preview and edit actions |
| **Edit Modals** | Form modals for section-level editing |
| **Preview Drawers** | Full document preview (Legal Pages) |
| **Save Draft / Publish** | Action buttons with preview-mode feedback |
| **Managed Content Notices** | Redirects to owner module for referenced content |
| **SEO Delegation Notices** | Redirects SEO editing to SEO module |

### Admin CMS — CRUD Action Flows

| Feature | Details |
|---------|---------|
| **Schema-Driven Forms** | `AdminFormDrawer` renders fields from `moduleFormSchemas.js` |
| **Gallery Management** | `AdminGalleryDrawer` for image gallery editing |
| **Linked Items** | `AdminLinkedItemsDrawer` for category-project relationships |
| **Confirm Actions** | `ConfirmActionModal` for destructive operations |
| **Form Field Types** | Text, textarea, select, number, toggle, image placeholder, gallery placeholder |

### Admin CMS — SEO Module

| Feature | Details |
|---------|---------|
| **Page List** | Auto-generated SEO records for all public routes |
| **SEO Inspector** | Side panel with meta title, description, OG preview |
| **Search Preview** | Google-style search result preview |
| **SEO Audit Panel** | Automated checks (title length, description, missing fields) |
| **Module Switcher** | Filter SEO pages by content module |
| **Stats Scope Switch** | Toggle statistics between all pages and filtered scope |
| **AI Assistant Panel** | Mock AI optimization suggestions |
| **AI Batch Optimization** | Bulk SEO improvement workflow (mock) |
| **AI Review Modal** | Review and apply AI-generated suggestions (mock) |

### Admin CMS — Users & Roles

| Feature | Details |
|---------|---------|
| **Users Table/Card View** | List admin users with status and role badges |
| **User Details Drawer** | Full user profile with activity timeline |
| **User Invite Modal** | Invite new admin users (UI only) |
| **User Edit Modal** | Edit user profile and role assignment |
| **Roles Section** | Role cards with permission summaries |
| **Role Edit Modal** | Edit role name, description, and permissions |
| **Permissions Matrix** | 18-module × 6-role permission grid |
| **Security Overview** | Security status summary panel |

### Admin CMS — Dashboard

| Feature | Details |
|---------|---------|
| **Welcome Hero** | Personalized greeting with environment badge |
| **KPI Cards** | Animated statistic cards (projects, team, careers, messages) |
| **Content Overview** | Cards linking to each content module with counts |
| **Quick Actions** | Shortcuts to common admin tasks |

### Admin Shell

| Feature | Details |
|---------|---------|
| **Collapsible Sidebar** | Expandable navigation groups; icon-only collapsed mode |
| **Mobile Drawer** | Overlay sidebar at ≤1024px viewport |
| **Top Bar** | Breadcrumbs, page title, secondary actions |
| **Environment Badge** | Dev/Prod indicator in sidebar footer |
| **Version Label** | CMS v1.0.0 in sidebar footer |

---

## Current Limitations

This section documents what the frontend **does not** do yet. These are intentional — backend integration will address them.

| Limitation | Details |
|-----------|---------|
| **Frontend Only** | No server-side rendering, no API calls, no database |
| **Mock Data** | All admin modules read from local mock files that transform `src/data/` |
| **No API Integration** | Save, delete, and update actions show preview-mode feedback only |
| **No Authentication** | Admin is openly accessible at `/admin/*` — no login, no session |
| **No Persistence** | All edits reset on page refresh; nothing is saved to disk or server |
| **No File Uploads** | Image and gallery fields use placeholder UI; no actual upload mechanism |
| **No Real CRUD** | Add/edit/delete flows are fully built in UI but do not mutate data |
| **Preview Mode Only** | Action feedback explicitly states "(preview mode)" on all save actions |
| **No Toast System** | `ActionFeedback` banner used instead; full toast stack not yet implemented |
| **No Real-Time Updates** | No WebSocket or polling; data is static after initial load |
| **No Email Integration** | Contact form and job applications do not send emails |
| **No Activity Log** | Dashboard has `RecentActivity` component built but not rendered |
| **Service Detail Pages** | `/services/:slug` routes render `PlaceholderPage` |
| **No i18n** | Single language (English) only |
| **No Automated Tests** | No unit, integration, or E2E tests configured |

---

## Backend Integration Notes

The frontend admin CMS is considered **complete**. Backend development must follow these rules:

### What Backend Must Do

1. **Replace mock data with APIs** — Each module's `mock/` folder defines the expected data shape. Backend APIs must return data matching these shapes.
2. **Follow existing routes** — Admin routes (`/admin/projects`, `/admin/seo`, etc.) and public routes (`/projects/:category/:project`, etc.) are the contract. Do not rename or restructure them.
3. **Reuse existing action flows** — `useAdminActionFlows`, `AdminFormDrawer`, and `moduleFormSchemas.js` define the CRUD interaction model. Backend endpoints must align with these flows (create, read, update, delete, bulk actions).
4. **Respect Single Source of Truth** — Backend data models must mirror the ownership table above. No duplicated content tables.
5. **Implement authentication** — Users & Roles module defines 6 roles and an 18-module permission matrix. Backend must enforce these permissions.
6. **Implement file uploads** — Image and gallery placeholder fields in form schemas expect a media upload API.
7. **Implement SEO as a separate service** — SEO metadata is managed exclusively in the SEO module, not inline in content modules.

### What Backend Must NOT Do

| Rule | Reason |
|------|--------|
| **Do not redesign the UI** | Every screen, component, and interaction is finalized |
| **Do not duplicate content ownership** | One module owns each content type |
| **Do not add WordPress-style features** | No generic page builders, plugins, or theme systems |
| **Do not change admin routes** | Routes are registered in `AdminRoutes.jsx` and `adminNavigation.js` |
| **Do not inline SEO fields in content modules** | SEO is delegated to the SEO module |
| **Do not create separate admin interfaces** | This CMS is the only admin interface |

### Integration Points

| Frontend File | Backend Responsibility |
|--------------|----------------------|
| `src/data/*.js` | Replace with API fetch + client cache |
| `src/modules/admin/*/mock/*Data.js` | Replace with API hooks calling backend endpoints |
| `src/modules/admin/*/mock/*Config.js` | Keep as frontend config (filters, sort options, page meta) |
| `src/modules/admin/cms/action-flows/moduleFormSchemas.js` | Form schemas stay frontend; backend validates matching fields |
| `src/modules/admin/seo/ai/seoAiMockService.js` | Replace with real AI API service |
| `src/modules/admin/users-roles/mock/usersRolesData.js` | Replace with auth provider + permission API |

---

## Folder Structure

```
Odeh-Website-Frontend/
│
├── index.html                  # Vite entry point, default SEO meta, font preload
├── package.json                # Dependencies and npm scripts
├── vite.config.js              # Vite + React plugin configuration
├── .gitignore                  # Ignores node_modules, dist, logs, editor files
│
├── scripts/                    # Asset pipeline utilities
│   ├── extract-hero-poster.mjs
│   ├── optimize-about-images.mjs
│   ├── optimize-overview-slider.mjs
│   ├── download-careers-images.mjs
│   ├── download-approach-images.py
│   ├── download-projects.py
│   └── ...
│
├── public/                     # Static assets served at root path
│   ├── odeh-logo2.png
│   ├── hero-poster.jpg
│   ├── video-slider.mp4
│   └── ...
│
└── src/
    ├── main.jsx                # React root, BrowserRouter, SmoothScrollProvider
    ├── App.jsx                 # Public + admin route definitions
    │
    ├── styles/
    │   └── global.css          # Site-wide CSS variables and base styles
    │
    ├── context/
    │   └── SmoothScrollContext.jsx   # Lenis smooth scroll (public site only)
    │
    ├── hooks/                  # Public site hooks
    │   ├── usePageMeta.js      # Dynamic title and meta description
    │   ├── useDebouncedValue.js
    │   ├── useHeroVideo.js
    │   ├── useHeroDepth.js
    │   ├── useScrollReveal.js
    │   └── useCountUp.js
    │
    ├── pages/                  # Public route page components (22 pages)
    │   ├── HomePage.jsx
    │   ├── AboutOverviewPage.jsx
    │   ├── ProjectsPage.jsx
    │   ├── CareersPage.jsx
    │   ├── ConnectPage.jsx
    │   └── ...
    │
    ├── components/             # Public UI components
    │   ├── Navbar/
    │   ├── Footer/
    │   ├── Hero/
    │   ├── AboutOverview/
    │   ├── AboutApproach/
    │   ├── AboutHistory/
    │   ├── AboutTeam/
    │   ├── AboutActivities/
    │   ├── Projects/
    │   ├── Services/
    │   ├── Careers/
    │   ├── Connect/
    │   ├── ReachOut/
    │   ├── SearchOverlay/
    │   ├── Carousel/
    │   ├── Gallery/
    │   └── ...
    │
    ├── data/                   # Public website content (Single Source of Truth)
    │   ├── projectsContent.js  # Categories, projects, helpers
    │   ├── projects.js         # Featured projects for homepage
    │   ├── services.js         # Service cards
    │   ├── careers.js          # Jobs, careers content
    │   ├── teamContent.js      # Team member profiles
    │   ├── activitiesContent.js
    │   ├── overviewContent.js  # About Overview page
    │   ├── approachContent.js  # About Approach page
    │   ├── historyContent.js   # About History page
    │   ├── navigation.js       # Nav links, footer, social, contact
    │   ├── connectLinks.js     # Connect page content
    │   ├── reachOutContent.js  # Contact form page
    │   ├── searchContent.js    # Search index
    │   ├── searchIndex.js
    │   ├── privacyPolicyContent.js
    │   ├── termsContent.js
    │   └── thankYouContent.js
    │
    └── modules/admin/          # Admin CMS (443 files)
        ├── routes/             # AdminRoutes.jsx
        ├── layout/             # AdminLayout, AdminSidebar, AdminTopBar
        ├── config/             # adminNavigation.js
        ├── context/            # AdminBreadcrumbContext
        ├── cms/                # Shared listing framework and action flows
        ├── ui/                 # Admin design system
        ├── hooks/              # Shared admin hooks
        ├── utils/              # Admin utilities
        ├── components/         # AdminIcons
        │
        ├── dashboard/          # Dashboard module
        ├── projects/           # Projects module
        ├── project-categories/ # Categories module
        ├── team-members/       # Team Members module
        ├── activities/         # Activities module
        ├── services/           # Services module
        ├── careers/            # Careers module
        ├── applications/       # Applications module
        ├── contact-messages/   # Contact Messages module
        ├── home-page/          # Home Page CMS module
        ├── about-pages/        # About Pages CMS module
        ├── navigation-footer/  # Navigation & Footer module
        ├── connect-page/       # Connect Page module
        ├── legal-pages/        # Legal Pages module
        ├── seo/                # SEO module (+ ai/ subfolder)
        ├── website-settings/   # Website Settings module
        └── users-roles/        # Users & Roles module
```

### Key Folder Purposes

| Folder | Purpose |
|--------|---------|
| `src/data/` | **Public content source of truth.** All website content lives here as JavaScript modules. Admin mock data transforms these files. Backend will replace this with API responses. |
| `src/pages/` | Public route page components. One file per route. |
| `src/components/` | Reusable public UI components organized by feature area. |
| `src/modules/admin/` | Entire admin CMS. Self-contained feature modules with pages, components, hooks, and mock data. |
| `src/modules/admin/ui/` | Admin design system. All admin UI must use these components. |
| `src/modules/admin/cms/` | Shared CMS framework. Listing layouts, action flows, reusable CMS components. |
| `src/modules/admin/*/mock/` | Mock data and configuration per module. Defines expected API data shapes. |
| `scripts/` | Asset pipeline for downloading, optimizing, and generating images and video posters. |
| `public/` | Static assets served directly by Vite at the root URL path. |

---

## Development Philosophy

These rules govern how the project is built and how backend integration must proceed.

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Single Source of Truth** | Every content type has exactly one owner module. Other modules reference, never duplicate. |
| **Website is the Contract** | Public pages define the content model. Admin modules map to public pages. Backend APIs serve the same model. |
| **Backend Follows Frontend** | The UI, routes, forms, and data shapes are finalized. Backend replaces mock data — it does not redesign anything. |
| **No Duplicated Content Ownership** | If Team Members owns team data, no other module stores or edits team records. |
| **No Unnecessary CMS Features** | No generic page builders, WYSIWYG editors for layout, or plugin systems. Each module is purpose-built. |
| **No WordPress-Style Complexity** | No themes, widgets, shortcodes, or custom post types. Simple, structured editors for structured content. |
| **Simple Editor Experience** | Administrators edit content in focused modules with clear sections, previews, and save actions. |

### Admin Module Conventions

Every admin feature module follows this internal structure:

```
module-name/
├── pages/          Page component (route target)
├── components/     Module-specific UI components
├── hooks/          State management and business logic
└── mock/
    ├── *Data.js    Mock records (mirrors future API response)
    └── *Config.js  Page meta, filters, sort options, bulk actions
```

### Adding a New Admin Module

1. Create module folder under `src/modules/admin/`
2. Add route in `AdminRoutes.jsx`
3. Add navigation item in `adminNavigation.js`
4. Add permission entry in `users-roles/mock/usersRolesData.js`
5. Use components from `ui/` and `cms/` — do not create one-off styles
6. Define form schema in `cms/action-flows/moduleFormSchemas.js` if CRUD is needed

---

## Future Backend Roadmap

This is a high-level roadmap for backend development. The frontend on this branch is complete and will not change structurally.

### Phase 1 — Foundation

| Task | Priority | Notes |
|------|----------|-------|
| **Authentication & Authorization** | Critical | Login, session management, role-based access per Users & Roles permission matrix |
| **Database Schema** | Critical | Models mirroring Single Source of Truth ownership table |
| **REST/GraphQL API** | Critical | Endpoints matching admin module mock data shapes |
| **CRUD Operations** | Critical | Create, read, update, delete for all content modules |
| **Media Upload Service** | High | Image and gallery upload for projects, team, activities |
| **File Storage** | High | S3 or local storage for uploaded media |

### Phase 2 — Integration

| Task | Priority | Notes |
|------|----------|-------|
| **Replace Mock Data** | Critical | Swap mock files with API hooks module by module |
| **Form Submission APIs** | High | Contact form (Reach Out) and job application endpoints |
| **SEO API** | High | CRUD for SEO metadata; integrate AI optimization service |
| **Search API** | Medium | Backend-powered site search replacing static index |
| **Email Notifications** | Medium | Contact form confirmations, application receipts |

### Phase 3 — Advanced

| Task | Priority | Notes |
|------|----------|-------|
| **Activity Log** | Medium | Audit trail for admin actions (Dashboard `RecentActivity`) |
| **Draft / Publish Workflow** | Medium | Content versioning and scheduled publishing |
| **AI SEO Service** | Low | Replace `seoAiMockService.js` with real AI API |
| **Analytics Integration** | Low | Website traffic and CMS usage metrics |
| **Toast Notification System** | Low | Replace `ActionFeedback` with full toast stack |
| **Automated Testing** | Low | Unit, integration, and E2E test suites |
| **i18n Support** | Low | Multi-language content management |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

| URL | Description |
|-----|-------------|
| `http://localhost:5173/` | Public website |
| `http://localhost:5173/admin/dashboard` | Admin CMS dashboard |

### Production Build

```bash
npm run build
```

Output is written to `dist/`. Verify the build succeeds before deploying.

### Preview Production Build

```bash
npm run preview
```

### Asset Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| Extract hero poster | `npm run extract-hero-poster` | Generate video poster frame |
| Optimize about images | `npm run optimize-about-images` | Compress About page images |
| Optimize overview slider | `npm run optimize-overview-slider` | Compress overview slider images |
| Download approach images | `npm run download-approach-images` | Fetch approach page assets |
| Download projects | `npm run download-projects` | Fetch project portfolio assets |
| Download careers images | `npm run download-careers-images` | Fetch careers page assets |

---

## Branch Information

This README documents the Git branch:

```
frontend-admin-complete
```

| Detail | Value |
|--------|-------|
| **Branch** | `frontend-admin-complete` |
| **Repository** | [https://github.com/AhmadAlHashaykeh/Odeh-Website-2026](https://github.com/AhmadAlHashaykeh/Odeh-Website-2026) |
| **Branch URL** | [https://github.com/AhmadAlHashaykeh/Odeh-Website-2026/tree/frontend-admin-complete](https://github.com/AhmadAlHashaykeh/Odeh-Website-2026/tree/frontend-admin-complete) |
| **Purpose** | Finalized frontend admin CMS before backend integration |
| **Status** | Frontend complete — mock data only, no API, no authentication |
| **Next Step** | Backend development (Phase 1: Authentication, Database, CRUD, API) |

This branch represents a stable snapshot of the entire frontend — both the public website and the admin CMS. All UI, routing, content models, and interaction patterns are finalized. Backend work begins from this branch without modifying the frontend structure.

---

**ODEH & PARTNERS** — Engineering & Consulting
