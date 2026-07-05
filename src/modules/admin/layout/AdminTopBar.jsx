import { Link } from 'react-router-dom';
import AdminIcon from '../components/AdminIcons';
import styles from './AdminTopBar.module.css';

export default function AdminTopBar({
  breadcrumbs,
  onMenuToggle,
  sidebarCollapsed,
  onSidebarToggle,
}) {
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuBtn}
          onClick={onMenuToggle}
          aria-label="Open navigation menu"
        >
          <AdminIcon name="menu" size={20} />
        </button>

        <button
          type="button"
          className={styles.collapseBtn}
          onClick={onSidebarToggle}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <AdminIcon name={sidebarCollapsed ? 'chevronRight' : 'chevronLeft'} size={18} />
        </button>

        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <ol className={styles.breadcrumbList}>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.label} className={styles.breadcrumbItem}>
                {index > 0 && <span className={styles.breadcrumbSep} aria-hidden="true">/</span>}
                {crumb.path ? (
                  <Link to={crumb.path} className={styles.breadcrumbLink}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={styles.breadcrumbCurrent} aria-current="page">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className={styles.center}>
        <div className={styles.search}>
          <AdminIcon name="search" size={18} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search content, pages, media..."
            aria-label="Global search"
          />
        </div>
      </div>

      <div className={styles.right}>
        <button type="button" className={styles.iconBtn} aria-label="Notifications">
          <AdminIcon name="bell" size={18} />
          <span className={styles.notificationDot} aria-hidden="true" />
        </button>

        <div className={styles.avatar} aria-label="Admin user">
          <span className={styles.avatarInitials}>OA</span>
        </div>

        <a href="/" target="_blank" rel="noopener noreferrer" className={styles.previewBtn}>
          <AdminIcon name="external" size={15} />
          <span>Preview Website</span>
        </a>

        <button type="button" className={styles.logoutBtn} aria-label="Logout">
          <AdminIcon name="logout" size={16} />
          <span className={styles.logoutLabel}>Logout</span>
        </button>
      </div>
    </header>
  );
}
