import AdminIcon from '../../components/AdminIcons';
import styles from './SeoModuleSwitcher.module.css';

export default function SeoModuleSwitcher({ modules, activeModuleId, onSelect, onBack }) {
  return (
    <div className={styles.bar}>
      <button type="button" className={styles.backBtn} onClick={onBack}>
        <AdminIcon name="chevronLeft" size={14} />
        All modules
      </button>

      <div className={styles.tabs} role="tablist" aria-label="Content modules">
        {modules.map((module) => {
          const isActive = module.id === activeModuleId;

          return (
            <button
              key={module.id}
              type="button"
              role="tab"
              className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
              onClick={() => onSelect(module.id)}
              aria-selected={isActive}
            >
              <AdminIcon name={module.icon} size={14} />
              <span>{module.label}</span>
              <span className={styles.tabCount}>{module.pageCount}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
