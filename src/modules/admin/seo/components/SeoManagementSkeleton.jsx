import styles from './SeoManagementSkeleton.module.css';

export default function SeoManagementSkeleton({ variant = 'modules' }) {
  if (variant === 'workspace') {
    return (
      <div className={styles.skeleton} aria-hidden="true">
        <div className={styles.stats}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={styles.statBlock} />
          ))}
        </div>
        <div className={styles.moduleBar} />
        <div className={styles.workspace}>
          <div className={styles.listPanel}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className={styles.listItem} />
            ))}
          </div>
          <div className={styles.inspector}>
            <div className={styles.inspectorHeader} />
            <div className={styles.inspectorGrid}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={styles.sectionBlock} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.stats}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.statBlock} />
        ))}
      </div>
      <div className={styles.moduleGrid}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={styles.moduleCard} />
        ))}
      </div>
    </div>
  );
}
