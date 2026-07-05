import styles from './Button.module.css';

const VARIANTS = ['primary', 'secondary', 'ghost', 'danger', 'accent'];
const SIZES = ['sm', 'md', 'lg'];

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  iconOnly = false,
  className = '',
  icon,
  ...rest
}) {
  const safeVariant = VARIANTS.includes(variant) ? variant : 'primary';
  const safeSize = SIZES.includes(size) ? size : 'md';

  const classNames = [
    styles.btn,
    styles[safeVariant],
    styles[safeSize],
    iconOnly ? styles.iconOnly : '',
    loading ? styles.loading : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled || loading}
      aria-disabled={disabled || loading || undefined}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && icon}
      {!iconOnly && children}
    </button>
  );
}
