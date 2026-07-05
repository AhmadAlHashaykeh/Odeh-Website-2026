import AdminIcon from '../../components/AdminIcons';
import styles from './GalleryPreview.module.css';

export default function GalleryPreview({ gallery = [], coverImage }) {
  const images = gallery.length > 0 ? gallery : coverImage ? [{ src: coverImage, alt: 'Cover' }] : [];

  if (images.length === 0) {
    return (
      <div className={styles.empty}>
        <AdminIcon name="images" size={24} />
        <span>No gallery images</span>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.header}>
        <h4 className={styles.title}>Gallery Preview</h4>
        <span className={styles.count}>
          <AdminIcon name="images" size={14} />
          {images.length} image{images.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className={styles.grid}>
        {images.slice(0, 8).map((image, index) => (
          <div key={`${image.src}-${index}`} className={styles.thumb}>
            <img src={image.src} alt={image.alt || `Gallery image ${index + 1}`} loading="lazy" />
          </div>
        ))}
        {images.length > 8 && (
          <div className={styles.more}>
            +{images.length - 8} more
          </div>
        )}
      </div>
    </div>
  );
}
