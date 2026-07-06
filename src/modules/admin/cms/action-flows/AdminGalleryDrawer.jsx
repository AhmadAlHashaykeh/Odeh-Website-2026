import { Drawer, Button } from '../../ui';
import AdminIcon from '../../components/AdminIcons';
import styles from './AdminGalleryDrawer.module.css';

export default function AdminGalleryDrawer({
  open,
  onClose,
  title = 'Manage Gallery',
  coverImage,
  gallery = [],
  itemLabel,
  onSave,
}) {
  const images = gallery.length > 0
    ? gallery
    : coverImage
      ? [{ src: coverImage, alt: 'Cover' }]
      : [];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size="large"
      stickyHeader
      stickyFooter
      title={title}
      footer={(
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={<AdminIcon name="check" size={16} />}
            onClick={onSave}
          >
            Save Gallery
          </Button>
        </>
      )}
    >
      {itemLabel && (
        <p className={styles.subtitle}>
          Managing gallery for <strong>{itemLabel}</strong>
        </p>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Cover Image</h3>
        {coverImage ? (
          <div className={styles.coverWrap}>
            <img src={coverImage} alt="Cover" className={styles.cover} />
            <span className={styles.coverBadge}>
              <AdminIcon name="star" size={12} />
              Current Cover
            </span>
          </div>
        ) : (
          <div className={styles.emptyCover}>
            <AdminIcon name="images" size={24} />
            <span>No cover image set</span>
          </div>
        )}
        <div className={styles.placeholderActions}>
          <span className={styles.placeholderBtn}>
            <AdminIcon name="upload" size={14} />
            Replace Cover
          </span>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Gallery Images</h3>
          <span className={styles.count}>{images.length} images</span>
        </div>

        <div className={styles.grid}>
          {images.map((image, index) => (
            <div key={`${image.src}-${index}`} className={styles.item}>
              <div className={styles.thumb}>
                <img src={image.src} alt={image.alt || `Image ${index + 1}`} />
                <span className={styles.orderHandle} aria-hidden="true">
                  <AdminIcon name="more" size={12} />
                </span>
              </div>
              <div className={styles.itemActions}>
                <button type="button" className={styles.itemBtn} disabled>
                  <AdminIcon name="star" size={12} />
                  Set Cover
                </button>
                <button type="button" className={styles.itemBtn} disabled>
                  <AdminIcon name="upload" size={12} />
                  Replace
                </button>
                <button type="button" className={`${styles.itemBtn} ${styles.removeBtn}`} disabled>
                  <AdminIcon name="trash" size={12} />
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className={styles.addPlaceholder}>
            <AdminIcon name="add" size={24} />
            <span>Add Image</span>
            <span className={styles.addHint}>File upload coming in a future release</span>
          </div>
        </div>
      </section>

      <p className={styles.notice}>
        <AdminIcon name="external" size={14} />
        Gallery images are displayed from stored URLs. Upload and reorder will be available in a future release.
      </p>
    </Drawer>
  );
}
