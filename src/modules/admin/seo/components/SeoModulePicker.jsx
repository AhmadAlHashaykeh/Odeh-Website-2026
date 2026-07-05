import AdminIcon from '../../components/AdminIcons';
import styles from './SeoModulePicker.module.css';

export default function SeoModulePicker({ modules, onSelect }) {
  return (
    <section className={styles.picker} aria-label="Content modules">
      <div className={styles.header}>
        <h2 className={styles.title}>Choose a content module</h2>
        <p className={styles.subtitle}>
          Select a module to manage SEO for related pages only.
        </p>
      </div>

      <div className={styles.grid} role="list">
        {modules.map((module) => (
          <button
            key={module.id}
            type="button"
            className={styles.card}
            onClick={() => onSelect(module.id)}
            role="listitem"
          >
            <span className={styles.iconWrap} aria-hidden="true">
              <AdminIcon name={module.icon} size={20} />
            </span>
            <span className={styles.cardBody}>
              <span className={styles.cardTitle}>{module.label}</span>
              <span className={styles.cardDescription}>{module.description}</span>
            </span>
            <span className={styles.count}>{module.pageCount}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
