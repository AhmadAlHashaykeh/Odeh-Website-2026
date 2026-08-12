import styles from './TeamCategoriesSkeleton.module.css';

export default function TeamCategoriesSkeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.stats} />
      <div className={styles.toolbar} />
      <div className={styles.table} />
    </div>
  );
}
