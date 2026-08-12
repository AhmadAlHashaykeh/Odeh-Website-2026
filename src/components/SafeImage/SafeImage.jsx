import { useEffect, useState } from 'react';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import styles from './SafeImage.module.css';

export default function SafeImage({
  src,
  fallbackSrc,
  alt,
  className = '',
  loading = 'lazy',
}) {
  const [currentSrc, setCurrentSrc] = useState(() => resolveMediaUrl(src));
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(resolveMediaUrl(src));
    setFailed(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    setFailed(true);
  };

  return (
    <div className={`${styles.wrap} ${className}`}>
      {!failed && (
        <img
          src={currentSrc}
          alt={alt}
          className={styles.image}
          loading={loading}
          decoding="async"
          draggable={false}
          onError={handleError}
        />
      )}
      {failed && (
        <div className={styles.placeholder} aria-hidden="true">
          <div className={styles.placeholderLines} />
          <span className={styles.placeholderLabel}>Project Preview</span>
        </div>
      )}
    </div>
  );
}
