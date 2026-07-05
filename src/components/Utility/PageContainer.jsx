import styles from './PageContainer.module.css';

export default function PageContainer({
  children,
  as: Tag = 'section',
  className = '',
  narrow = false,
  ariaLabel,
}) {
  return (
    <Tag className={`${styles.section} ${className}`} aria-label={ariaLabel}>
      <div className={`container ${styles.container} ${narrow ? styles.narrow : ''}`}>
        {children}
      </div>
    </Tag>
  );
}
