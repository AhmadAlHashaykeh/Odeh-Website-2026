import { useMemo } from 'react';
import { useRotatingImage } from '../../hooks/useRotatingImage';
import {
  CATEGORY_IMAGE_ROTATION_MS,
  resolveCategoryFallbackImage,
} from '../../utils/categoryProjectImages';
import styles from './RotatingCategoryImage.module.css';

export default function RotatingCategoryImage({
  images = [],
  fallbackSrc,
  category,
  alt = '',
  className = '',
  imageClassName = '',
  priority = false,
  intervalMs = CATEGORY_IMAGE_ROTATION_MS,
}) {
  const imagesKey = (images ?? []).filter(Boolean).join('\0');
  const fallback = fallbackSrc || resolveCategoryFallbackImage(category);

  const sources = useMemo(() => {
    const unique = [];
    const seen = new Set();

    for (const src of imagesKey ? imagesKey.split('\0') : []) {
      if (!src || seen.has(src)) continue;
      seen.add(src);
      unique.push(src);
    }

    if (unique.length === 0 && fallback) {
      unique.push(fallback);
    }

    return unique;
  }, [imagesKey, fallback]);

  const { index, isRotating } = useRotatingImage(sources, { intervalMs });

  if (sources.length === 0) {
    return (
      <div
        className={`${styles.wrap} ${styles.empty} ${className}`.trim()}
        aria-hidden="true"
      />
    );
  }

  if (!isRotating) {
    return (
      <div className={`${styles.wrap} ${className}`.trim()}>
        <img
          src={sources[0]}
          alt={alt}
          className={`${styles.image} ${styles.active} ${imageClassName}`.trim()}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={`${styles.wrap} ${className}`.trim()}>
      {sources.map((src, imageIndex) => (
        <img
          key={src}
          src={src}
          alt={imageIndex === index ? alt : ''}
          aria-hidden={imageIndex === index ? undefined : true}
          className={`${styles.image} ${imageIndex === index ? styles.active : ''} ${imageClassName}`.trim()}
          loading={priority && imageIndex === 0 ? 'eager' : 'lazy'}
          decoding="async"
        />
      ))}
    </div>
  );
}
