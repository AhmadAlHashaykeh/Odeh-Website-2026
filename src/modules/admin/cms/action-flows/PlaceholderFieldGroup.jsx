import AdminIcon from '../../components/AdminIcons';
import styles from './PlaceholderFieldGroup.module.css';

export function ImagePlaceholder({ label, compact = false }) {
  return (
    <div className={styles.group}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={`${styles.placeholder} ${compact ? styles.placeholderCompact : ''}`}>
        <AdminIcon name="upload" size={22} />
        <span className={styles.placeholderText}>Click to upload image</span>
        <span className={styles.placeholderHint}>Drag and drop or browse files</span>
      </div>
    </div>
  );
}

export function CoverImageField({ label = 'Cover Image', src, alt }) {
  return (
    <div className={styles.group}>
      <span className={styles.label}>{label}</span>
      {src ? (
        <div className={`${styles.preview} ${styles.coverPreview}`}>
          <img src={src} alt={alt || 'Cover'} />
        </div>
      ) : (
        <ImagePlaceholder />
      )}
      <div className={styles.actions}>
        <span className={styles.actionBtn}>
          <AdminIcon name="upload" size={12} />
          Replace
        </span>
        <span className={styles.actionBtn}>
          <AdminIcon name="trash" size={12} />
          Remove
        </span>
      </div>
    </div>
  );
}

export function GalleryPlaceholder({ label = 'Gallery', images = [], maxPreview = 4 }) {
  const preview = images.slice(0, maxPreview);

  return (
    <div className={styles.group}>
      <span className={styles.label}>{label}</span>
      {preview.length > 0 ? (
        <div className={styles.galleryGrid}>
          {preview.map((image, index) => (
            <div key={`${image.src}-${index}`} className={styles.galleryThumb}>
              <img src={image.src} alt={image.alt || `Gallery ${index + 1}`} />
            </div>
          ))}
        </div>
      ) : (
        <ImagePlaceholder compact />
      )}
      <div className={styles.actions}>
        <span className={styles.actionBtn}>
          <AdminIcon name="add" size={12} />
          Add Images
        </span>
        <span className={styles.actionBtn}>
          <AdminIcon name="images" size={12} />
          Manage Gallery
        </span>
      </div>
    </div>
  );
}

export default function PlaceholderFieldGroup({ type, ...props }) {
  if (type === 'cover') return <CoverImageField {...props} />;
  if (type === 'gallery') return <GalleryPlaceholder {...props} />;
  return <ImagePlaceholder {...props} />;
}
