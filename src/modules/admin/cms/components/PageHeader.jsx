import { Link } from 'react-router-dom';
import { Button } from '../../ui';
import AdminIcon from '../../components/AdminIcons';
import styles from './PageHeader.module.css';

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  primaryAction,
  secondaryActions = [],
}) {
  return (
    <header className={styles.header}>
      {breadcrumbs.length > 0 && (
        <nav className={styles.breadcrumb} aria-label="Page breadcrumb">
          <ol className={styles.breadcrumbList}>
            {breadcrumbs.map((crumb, index) => (
              <li key={`${crumb.label}-${index}`} className={styles.breadcrumbItem}>
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
      )}

      <div className={styles.main}>
        <div className={styles.text}>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        <div className={styles.actions}>
          {secondaryActions.map((action) => (
            <Button
              key={action.label}
              variant="secondary"
              icon={action.icon ? <AdminIcon name={action.icon} size={16} /> : undefined}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}

          {primaryAction && (
            <Button
              variant="primary"
              icon={primaryAction.icon ? <AdminIcon name={primaryAction.icon} size={16} /> : undefined}
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
