import { Link } from 'react-router-dom';
import AdminIcon from '../../components/AdminIcons';
import styles from './WebsiteShortcutCard.module.css';

export default function WebsiteShortcutCard({ shortcut }) {
  return (
    <Link to={shortcut.path} className={styles.card}>
      <div className={styles.iconWrap} aria-hidden="true">
        <AdminIcon name={shortcut.icon} size={18} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{shortcut.title}</h3>
        <p className={styles.desc}>{shortcut.description}</p>
      </div>
      <AdminIcon name="chevronRight" size={16} className={styles.arrow} />
    </Link>
  );
}
