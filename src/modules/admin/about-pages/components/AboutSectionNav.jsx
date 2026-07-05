import AdminIcon from '../../components/AdminIcons';
import styles from './AboutSectionNav.module.css';

export default function AboutSectionNav({
  sections,
  activeSection,
  onSelect,
  ariaLabel = 'About page sections',
}) {
  return (
    <nav className={styles.nav} aria-label={ariaLabel}>
      <ul className={styles.list}>
        {sections.map((section) => {
          const isActive = section.id === activeSection;

          return (
            <li key={section.id}>
              <button
                type="button"
                className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                onClick={() => onSelect(section.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <AdminIcon name={section.icon} size={16} />
                <span>{section.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
