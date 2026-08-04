import { useScrollReveal } from '../../hooks/useScrollReveal';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import styles from './OverviewContent.module.css';

export default function OverviewContent({ title, description, image }) {
  const textRef = useScrollReveal();
  const imageRef = useScrollReveal(0.08);
  const imageSrc = resolveMediaUrl(image);
  const imageAlt = typeof image === 'object' && image ? image.alt : '';

  return (
    <section className={styles.content} aria-label="Company overview">
      <div className="container">
        <div className={styles.grid}>
          <div ref={textRef} className={`${styles.textCol} reveal`}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
          </div>

          {imageSrc ? (
            <div ref={imageRef} className={`${styles.imageWrap} reveal reveal-delay-1`}>
              <div className={styles.imageFrame}>
                <img src={imageSrc} alt={imageAlt || ''} loading="lazy" decoding="async" />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
