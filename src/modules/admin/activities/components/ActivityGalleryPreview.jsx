import AdminIcon from '../../components/AdminIcons';
import styles from './ActivityGalleryPreview.module.css';

function extractFileName(src) {
  if (!src) return 'image.jpg';
  const parts = src.split('/');
  return parts[parts.length - 1] || 'image.jpg';
}

function mockDimensions(index) {
  const sizes = [
    '1920 × 1280',
    '1600 × 1067',
    '2048 × 1365',
    '1280 × 853',
  ];
  return sizes[index % sizes.length];
}

function mockFileSize(index) {
  const sizes = ['1.2 MB', '890 KB', '2.4 MB', '1.6 MB', '740 KB'];
  return sizes[index % sizes.length];
}

export default function ActivityGalleryPreview({ gallery = [], coverImage }) {
  const images = gallery.length > 0
    ? gallery
    : coverImage
      ? [{ src: coverImage, alt: 'Cover' }]
      : [];

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
        {images.slice(0, 6).map((image, index) => {
          const isCover = image.src === coverImage || index === 0;
          return (
            <div key={`${image.src}-${index}`} className={styles.item}>
              <div className={styles.thumb}>
                <img
                  src={image.src}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  loading="lazy"
                />
                {isCover && (
                  <span className={styles.coverBadge}>
                    <AdminIcon name="star" size={10} />
                    Cover
                  </span>
                )}
              </div>
              <div className={styles.meta}>
                <span className={styles.fileName}>{extractFileName(image.src)}</span>
                <span className={styles.fileDetails}>
                  {mockDimensions(index)} · {mockFileSize(index)}
                </span>
              </div>
            </div>
          );
        })}
        {images.length > 6 && (
          <div className={styles.more}>
            <AdminIcon name="images" size={20} />
            <span>+{images.length - 6} more</span>
          </div>
        )}
      </div>
    </div>
  );
}
