import styles from './SeoAiBadge.module.css';

const VARIANTS = {
  info: styles.info,
  warning: styles.warning,
  success: styles.success,
  neutral: styles.neutral,
};

export default function SeoAiBadge({ label, variant = 'neutral', title }) {
  return (
    <span className={`${styles.badge} ${VARIANTS[variant] ?? VARIANTS.neutral}`} title={title}>
      {label}
    </span>
  );
}
