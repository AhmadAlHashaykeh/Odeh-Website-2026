import AdminIcon from '../../components/AdminIcons';
import Button from './Button';
import styles from './EmptyState.module.css';

export default function EmptyState({
  icon = 'empty',
  title = 'No items found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  action,
  variant = 'default',
  className = '',
}) {
  const isFeatured = variant === 'featured';

  return (
    <div className={`${styles.empty} ${isFeatured ? styles.featured : ''} ${className}`}>
      {isFeatured ? (
        <div className={styles.visual}>
          <div className={styles.iconWrap}>
            <AdminIcon name={icon} size={36} />
          </div>
          <div className={styles.accentLine} aria-hidden="true" />
        </div>
      ) : (
        <div className={styles.iconWrap}>
          <AdminIcon name={icon} size={32} />
        </div>
      )}

      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>

      {action && (
        <div className={styles.actions}>
          <Button
            variant="primary"
            size={isFeatured ? 'lg' : 'md'}
            icon={action.icon ? <AdminIcon name={action.icon} size={16} /> : undefined}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
