import { StatusBadge } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import ServiceQuickActions from './ServiceQuickActions';
import styles from './ServicesTableView.module.css';

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function PublicationBadge({ status }) {
  if (status === 'published') {
    return <StatusBadge status="active" label="Published" />;
  }
  if (status === 'draft') {
    return <StatusBadge status="pending" label="Draft" />;
  }
  return <StatusBadge status="inactive" label="Hidden" />;
}

export default function ServicesTableView({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  isAllSelected,
  isSomeSelected,
  onServiceClick,
  onViewService,
  onAction,
}) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.checkboxCol}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isSomeSelected && !isAllSelected;
                }}
                onChange={onToggleSelectAll}
                aria-label="Select all services on this page"
              />
            </th>
            <th className={styles.thumbCol}>Image</th>
            <th>Service</th>
            <th>Slug</th>
            <th>Homepage</th>
            <th>SEO</th>
            <th>Status</th>
            <th>Display Order</th>
            <th>Last Updated</th>
            <th className={styles.actionsCol} aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {items.map((service) => (
            <tr
              key={service.id}
              className={`${styles.row} ${selectedIds.has(service.id) ? styles.selected : ''}`}
            >
              <td className={styles.checkboxCol}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedIds.has(service.id)}
                  onChange={() => onToggleSelect(service.id)}
                  aria-label={`Select ${service.title}`}
                />
              </td>
              <td className={styles.thumbCol}>
                <button
                  type="button"
                  className={styles.thumbBtn}
                  onClick={() => onServiceClick(service.id)}
                  aria-label={`View ${service.title}`}
                >
                  <img src={resolveMediaUrl(service.image)}
                    alt=""
                    className={styles.thumb}
                    loading="lazy"
                  />
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className={styles.nameBtn}
                  onClick={() => onServiceClick(service.id)}
                >
                  <span className={styles.name}>{service.title}</span>
                </button>
              </td>
              <td className={styles.muted}>{service.slug}</td>
              <td>
                {service.usedOnHomepage ? (
                  <span className={styles.homepageYes}>
                    <AdminIcon name="home" size={12} />
                    Yes
                  </span>
                ) : (
                  <span className={styles.homepageNo}>No</span>
                )}
              </td>
              <td>
                <span className={`${styles.seoBadge} ${styles[service.seoStatus]}`}>
                  {service.seoStatus === 'complete' ? 'Ready' : 'Pending'}
                </span>
              </td>
              <td><PublicationBadge status={service.status} /></td>
              <td className={styles.muted}>#{service.displayOrder}</td>
              <td className={styles.muted}>{formatDate(service.lastUpdated)}</td>
              <td className={styles.actionsCol}>
                <ServiceQuickActions service={service} onView={onViewService} onAction={onAction} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
