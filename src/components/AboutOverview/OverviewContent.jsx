import { useScrollReveal } from '../../hooks/useScrollReveal';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import styles from './OverviewContent.module.css';

export default function OverviewContent({ title, description, image }) {
  const textRef = useScrollReveal();
  const imageRef = useScrollReveal(0.08);

  return (
    <section className={styles.content} aria-label="Company overview">
      <div className="container">
        <div className={styles.grid}>
          <div ref={textRef} className={`${styles.textCol} reveal`}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
          </div>

          <div ref={imageRef} className={`${styles.imageWrap} reveal reveal-delay-1`}>
            <div className={styles.imageFrame}>
              <img src={resolveMediaUrl(image.src)} alt={image.alt} loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
