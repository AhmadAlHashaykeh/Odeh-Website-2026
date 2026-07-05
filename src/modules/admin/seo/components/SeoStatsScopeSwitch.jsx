import styles from './SeoStatsScopeSwitch.module.css';

export default function SeoStatsScopeSwitch({ value, onChange, moduleSelected }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.switcher} role="group" aria-label="Statistics scope">
        <button
          type="button"
          className={`${styles.btn} ${value === 'website' ? styles.active : ''}`}
          onClick={() => onChange('website')}
          aria-pressed={value === 'website'}
        >
          Website Overview
        </button>
        <button
          type="button"
          className={`${styles.btn} ${value === 'module' ? styles.active : ''} ${!moduleSelected ? styles.disabled : ''}`}
          onClick={() => moduleSelected && onChange('module')}
          aria-pressed={value === 'module'}
          disabled={!moduleSelected}
          title={moduleSelected ? undefined : 'Select a module first'}
        >
          Module Overview
        </button>
      </div>
    </div>
  );
}
