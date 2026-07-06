import { Drawer, Button } from '../../ui';
import AdminIcon from '../../components/AdminIcons';
import styles from './AdminLinkedItemsDrawer.module.css';

export default function AdminLinkedItemsDrawer({
  open,
  onClose,
  title = 'Manage Projects',
  subtitle,
  items = [],
  emptyMessage = 'No linked items',
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="large"
      stickyHeader
      stickyFooter
      title={title}
      footer={(
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      )}
    >
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      {items.length === 0 ? (
        <div className={styles.empty}>
          <AdminIcon name="projects" size={28} />
          <span>{emptyMessage}</span>
        </div>
      ) : (
        <div className={styles.list}>
          {items.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.thumb}>
                {item.coverImage && (
                  <img src={item.coverImage} alt="" loading="lazy" />
                )}
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{item.title}</span>
                {item.slug && <span className={styles.slug}>/{item.slug}</span>}
              </div>
              <span className={styles.badge}>Linked</span>
            </div>
          ))}
        </div>
      )}

      <p className={styles.notice}>
        <AdminIcon name="external" size={14} />
        Linked projects are read-only. Manage project assignments from the Projects module.
      </p>
    </Drawer>
  );
}
