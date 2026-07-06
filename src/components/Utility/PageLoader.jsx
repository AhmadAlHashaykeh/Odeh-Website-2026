import styles from './PageLoader.module.css';

export default function PageLoader() {
  return (
    <div className={styles.loader} role="status" aria-live="polite" aria-label="Loading content">
      <div className={styles.spinner} aria-hidden="true" />
    </div>
  );
}
