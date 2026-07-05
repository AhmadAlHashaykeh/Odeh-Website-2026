import styles from './Badge.module.css';

const VARIANTS = [
  'success', 'warning', 'error', 'info',
  'draft', 'published', 'archived', 'featured', 'new', 'neutral',
];

const STATUS_MAP = {
  published: 'published',
  draft: 'draft',
  archived: 'archived',
  active: 'success',
  pending: 'info',
  inactive: 'neutral',
  featured: 'featured',
  new: 'new',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
};

export default function Badge({
  children,
  variant,
  status,
  dot = false,
  className = '',
}) {
  const resolvedVariant = variant || STATUS_MAP[status] || 'neutral';
  const safeVariant = VARIANTS.includes(resolvedVariant) ? resolvedVariant : 'neutral';

  return (
    <span className={`${styles.badge} ${styles[safeVariant]} ${className}`}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
}

Badge.fromStatus = function fromStatus(status, label) {
  const config = STATUS_MAP[status] || 'neutral';
  return <Badge variant={config}>{label || status}</Badge>;
};
