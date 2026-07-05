/**
 * Editorial image collage (1 large + 2 overlapping images).
 *
 * @param {Object} props
 * @param {string} [props.ariaLabel] - Accessible section label
 * @param {Array<{ src: string, alt: string, variant: 'primary' | 'secondaryTop' | 'secondaryBottom' }>} props.images
 */
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './EditorialGallery.module.css';

const variantClass = {
  primary: styles.primary,
  secondaryTop: styles.secondaryTop,
  secondaryBottom: styles.secondaryBottom,
};

export default function EditorialGallery({ ariaLabel = 'Image gallery', images }) {
  const sectionRef = useScrollReveal(0.08);

  return (
    <section className={styles.gallery} aria-label={ariaLabel}>
      <div className="container">
        <div ref={sectionRef} className={`${styles.collage} reveal`}>
          {images.map((image, index) => (
            <figure
              key={image.src}
              className={`${styles.item} ${variantClass[image.variant]} ${styles.revealItem} reveal-delay-${index + 1}`}
            >
              <div className={styles.imageFrame}>
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  width={1400}
                  height={900}
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
