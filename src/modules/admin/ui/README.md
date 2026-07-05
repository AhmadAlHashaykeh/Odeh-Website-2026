# Admin UI System

Internal design system for the ODEH Admin Dashboard. All future CMS modules should consume components from `src/modules/admin/ui/` rather than writing one-off styles.

## Quick Start

```jsx
import {
  Button,
  Input,
  Select,
  Badge,
  Card,
  Modal,
  Drawer,
  EmptyState,
  SkeletonLoader,
  Form,
  Table,
} from '../ui';
```

Styles and tokens load automatically via `AdminLayout` (`admin-ui.css`).

---

## Folder Structure

```
src/modules/admin/ui/
├── tokens/admin-tokens.css    # Design tokens (CSS custom properties)
├── styles/admin-ui.css        # Typography utilities + motion keyframes
├── components/                # Reusable UI primitives
├── hooks/                     # useModal, useDrawer
├── index.js                   # Barrel exports
└── README.md                  # This file
```

---

## Components

### Button

Variants: `primary` | `secondary` | `ghost` | `danger` | `accent`  
Sizes: `sm` | `md` | `lg`  
Props: `loading`, `disabled`, `iconOnly`, `icon`

```jsx
<Button variant="primary" icon={<AdminIcon name="add" size={16} />}>
  Add Item
</Button>
<Button variant="danger" loading>Deleting…</Button>
<Button variant="ghost" iconOnly size="sm" aria-label="Close">
  <AdminIcon name="close" size={16} />
</Button>
```

### Input

Types: `text`, `search`, `password`, `number`  
States: `error`, `success`, `disabled`, `readOnly`  
Sub-components: `Input.Textarea`, `Input.Field`

```jsx
<Input label="Title" required placeholder="Enter title" />
<Input type="search" icon={<AdminIcon name="search" size={16} />} />
<Input.Textarea label="Description" rows={5} />
```

### Select

Variants: default, `Select.Filter`, `Select.Multi` (visual), `Select.Searchable` (visual)

```jsx
<Select label="Status" value={status} onChange={setStatus} options={options} icon="filter" />
<Select.Filter label="Category" ... />
```

### Badge

Variants: `success`, `warning`, `error`, `info`, `draft`, `published`, `archived`, `featured`, `new`, `neutral`

```jsx
<Badge variant="published">Published</Badge>
<Badge variant="featured" dot>Featured</Badge>
```

### Card

Variants: `standard`, `statistic`, `interactive`, `glass`, `panel`, `section`  
Sub-component: `Card.Statistic`

```jsx
<Card variant="interactive" title="Project Name" selected={isSelected}>
  Content here
</Card>
<Card.Statistic value="24" label="Total Projects" />
```

### Modal

Sizes: default, `large`  
Sub-components: `Modal.Confirmation`, `Modal.Actions`

```jsx
<Modal open={open} onClose={close} title="Edit Item" scrollable>
  {children}
</Modal>
<Modal.Confirmation open={open} title="Delete?" onConfirm={confirm} onCancel={cancel} />
```

### Drawer

Sizes: default, `large`  
Sub-components: `Drawer.Header`, `Drawer.Footer`  
Props: `stickyHeader`, `stickyFooter`, `flush`

```jsx
<Drawer open={open} onClose={close} title="Details" stickyFooter footer={<Drawer.Footer>...</Drawer.Footer>}>
  {content}
</Drawer>
```

### Table

Compound component: `Table` (wrap), `.Root`, `.Head`, `.Body`, `.Row`, `.HeaderCell`, `.Cell`, `.TitleCell`

```jsx
<Table stickyHeader>
  <Table.Root>...</Table.Root>
</Table>
```

### Form

Compound: `Form`, `Form.Section`, `Form.Field`, `Form.Row`, `Form.Divider`, `Form.Actions`

### EmptyState

Variants: `default`, `featured`

```jsx
<EmptyState
  icon="projects"
  title="No projects found"
  description="..."
  action={{ label: 'Add Project', icon: 'add', onClick: handleAdd }}
/>
```

### Skeleton

Variants via `SkeletonLoader`: `full`, `table`, `cards`, `form`, `list`, `stats`  
Sub-components: `Skeleton.Stats`, `.Toolbar`, `.Table`, `.Cards`, `.Form`, `.List`

```jsx
<SkeletonLoader variant="full" viewMode="table" />
```

### Toast (design only)

See `components/ToastPattern.md` for visual specification. No runtime implementation yet.

---

## Design Tokens

All tokens are scoped to `[data-admin-layout]` in `tokens/admin-tokens.css`.

| Category | Examples |
|----------|----------|
| Colors | `--admin-color-success`, `--admin-color-error`, `--admin-color-featured` |
| Spacing | `--admin-space-sm` … `--admin-space-6xl`, `--admin-section-gap` |
| Typography | `--admin-font-page-title`, `--admin-font-badge`, `--admin-font-caption` |
| Shadows | `--admin-shadow-sm`, `--admin-shadow-modal`, `--admin-shadow-focus` |
| Motion | `--admin-duration-fast`, `--admin-ease-default` |
| Z-index | `--admin-z-modal`, `--admin-z-drawer`, `--admin-z-toast` |
| Sizing | `--admin-input-height`, `--admin-drawer-width`, `--admin-modal-width` |

Global site tokens from `src/styles/global.css` (`--color-accent`, `--radius-md`, etc.) are also used.

---

## Naming Conventions

| Pattern | Example |
|---------|---------|
| Components | PascalCase — `Button`, `EmptyState` |
| Variants | lowercase string prop — `variant="primary"` |
| CSS modules | co-located — `Button.module.css` |
| Tokens | `--admin-{category}-{name}` |
| Hooks | camelCase with `use` prefix — `useModal` |

---

## Best Practices

1. **Import from `ui/`** — never duplicate button/input/badge styles in module CSS.
2. **Use tokens** — reference `--admin-*` variables instead of hardcoded values.
3. **Compose, don't copy** — wrap UI primitives; don't fork CSS modules.
4. **Keep CMS components thin** — `cms/components/` should orchestrate; `ui/` should render.
5. **Respect motion** — all animations honor `prefers-reduced-motion`.
6. **Maintain accessibility** — use `aria-*` props, focus rings, and semantic HTML from primitives.

---

## Migration Status

| Component | Status |
|-----------|--------|
| PageHeader | Uses `Button` |
| DeleteModal | Uses `ConfirmationModal` |
| SearchField | Uses `Input` |
| FilterDropdown | Uses `Select` |
| StatusBadge | Uses `Badge` |
| EmptyState | Re-exports from `ui` |
| SkeletonLoader | Re-exports from `ui` |
| TableView | Uses `Table` compound |
| ProjectsEmptyState | Uses `EmptyState` (featured variant) |
| ProjectsSkeleton | Uses `SkeletonLoader` |

Future modules (Services, Careers, Media, etc.) can import the entire system from `../ui`.
