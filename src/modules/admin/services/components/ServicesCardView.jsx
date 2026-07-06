import { StatusBadge } from '../../cms/components';
import AdminIcon from '../../components/AdminIcons';
import ServiceQuickActions from './ServiceQuickActions';
import styles from './ServicesCardView.module.css';

function PublicationBadge({ status }) {
  if (status === 'published') {
    return <StatusBadge status="active" label="Published" />;
  }
  if (status === 'draft') {
    return <StatusBadge status="pending" label="Draft" />;
  }
  return <StatusBadge status="inactive" label="Hidden" />;
}

function HomepageBadge({ usedOnHomepage }) {
  if (usedOnHomepage) {
    return (
      <span className={styles.homepageBadge}>
        <AdminIcon name="home" size={11} />
        Homepage
      </span>
    );
  }
  return <span className={styles.notHomepage}>Not on Homepage</span>;
}

function SeoBadge({ seoStatus }) {
  return (
    <span className={`${styles.seoBadge} ${styles[seoStatus]}`}>
      SEO {seoStatus === 'complete' ? 'Ready' : 'Pending'}
    </span>
  );
}

export default function ServicesCardView({
  items,
  selectedIds,
  onToggleSelect,
  onServiceClick,
  onViewService,
  onAction,
}) {
  return (
    <div className={styles.grid}>
      {items.map((service) => (
        <article
          key={service.id}
          className={`${styles.card} ${selectedIds.has(service.id) ? styles.selected : ''}`}
        >
          <div className={styles.imageWrap}>
            <button
              type="button"
              className={styles.imageBtn}
              onClick={() => onServiceClick(service.id)}
              aria-label={`View ${service.title}`}
            >
              <img src={resolveMediaUrl(service.image)}
                alt={service.title}
                className={styles.image}
                loading="lazy"
              />
              <div className={styles.imageOverlay} aria-hidden="true" />
            </button>

            <div className={styles.cardTop}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selectedIds.has(service.id)}
                onChange={() => onToggleSelect(service.id)}
                aria-label={`Select ${service.title}`}
              />
              <ServiceQuickActions service={service} onView={onViewService} onAction={onAction} />
            </div>

            <span className={styles.orderBadge}>#{service.displayOrder}</span>
          </div>

          <div className={styles.body}>
            <button
              type="button"
              className={styles.titleBtn}
              onClick={() => onServiceClick(service.id)}
            >
              <h3 className={styles.title}>{service.title}</h3>
            </button>

            <p className={styles.description}>{service.descriptionPreview}</p>

            <div className={styles.badges}>
              <HomepageBadge usedOnHomepage={service.usedOnHomepage} />
              <PublicationBadge status={service.status} />
              <SeoBadge seoStatus={service.seoStatus} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
