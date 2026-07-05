import AdminIcon from '../../components/AdminIcons';
import styles from './ViewSwitcher.module.css';

export default function ViewSwitcher({ view, onChange }) {
  return (
    <div className={styles.switcher} role="group" aria-label="View mode">
      <button
        type="button"
        className={`${styles.btn} ${view === 'table' ? styles.active : ''}`}
        onClick={() => onChange('table')}
        aria-label="Table view"
        aria-pressed={view === 'table'}
      >
        <AdminIcon name="listView" size={16} />
      </button>
      <button
        type="button"
        className={`${styles.btn} ${view === 'card' ? styles.active : ''}`}
        onClick={() => onChange('card')}
        aria-label="Card view"
        aria-pressed={view === 'card'}
      >
        <AdminIcon name="gridView" size={16} />
      </button>
    </div>
  );
}
