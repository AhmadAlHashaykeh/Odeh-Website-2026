import { Link } from 'react-router-dom';
import AdminIcon from '../../components/AdminIcons';
import styles from './CmsModuleShortcut.module.css';

export default function CmsModuleShortcut({
  title,
  description,
  path,
  icon = 'external',
  className = '',
}) {
  return (
    <Link to={path} className={`${styles.card} ${className}`.trim()}>
      <div className={styles.iconWrap} aria-hidden="true">
        <AdminIcon name={icon} size={18} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description ? <p className={styles.desc}>{description}</p> : null}
      </div>
      <AdminIcon name="chevronRight" size={16} className={styles.arrow} />
    </Link>
  );
}
