# Toast Notification Pattern (Design Only)

> Visual specification for future toast implementation. No runtime code yet.

## Placement

- Fixed position: top-right, `1.5rem` from edges
- Stack vertically with `0.75rem` gap
- Z-index: `var(--admin-z-toast)` (1100)

## Container

```
Width:        min(380px, calc(100vw - 2rem))
Padding:      1rem 1.15rem
Border-radius: var(--radius-md)
Background:   rgba(35, 35, 35, 0.96)
Border:       1px solid var(--color-border)
Backdrop:     blur(16px)
Shadow:       0 8px 32px rgba(0, 0, 0, 0.35)
Animation:    slide in from right + fade (0.3s)
```

## Variants

| Variant | Left accent | Icon color | Icon background |
|---------|-------------|------------|-----------------|
| Success | `#4ade80` | `#4ade80` | `rgba(74, 222, 128, 0.12)` |
| Error   | `#fb7185` | `#fb7185` | `rgba(244, 63, 94, 0.12)` |
| Info    | `#00a8c9` | `#00a8c9` | `rgba(0, 138, 166, 0.12)` |
| Warning | `#fbbf24` | `#fbbf24` | `rgba(251, 191, 36, 0.12)` |

Each toast has a 3px left border in the accent color.

## Typography

- **Title**: 0.84rem, weight 600, white
- **Message**: 0.78rem, muted, line-height 1.5
- **Dismiss button**: ghost icon, 32×32px

## Behavior (future)

- Auto-dismiss after 5s (success/info), 8s (error/warning)
- Pause on hover
- Max 3 visible; queue additional
- Respect `prefers-reduced-motion`

## Usage examples (when implemented)

```jsx
// Success after save
toast.success('Project saved', 'Changes are visible on the website.');

// Error on failure
toast.error('Upload failed', 'Image exceeds the 5 MB limit.');

// Info notification
toast.info('Draft saved', 'Your progress was saved automatically.');
```
