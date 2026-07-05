/**
 * Two-column section with text content and a premium image.
 *
 * @param {Object} props
 * @param {string} [props.id] - Optional section id for anchor links
 * @param {string[]} props.paragraphs - Body paragraphs (first is styled as lead)
 * @param {{ src: string, alt: string, width?: number, height?: number }} props.image
 * @param {'left' | 'right'} [props.imagePosition='right'] - Image column placement on desktop
 */
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './ContentImageSection.module.css';

export default function ContentImageSection({
  id,
  paragraphs,
  image,
  imagePosition = 'right',
}) {
  const contentRef = useScrollReveal();
  const imageRef = useScrollReveal(0.1);

  const sectionClass =
    imagePosition === 'left' ? `${styles.section} ${styles.imageLeft}` : styles.section;

  return (
    <section className={sectionClass} id={id}>
      <div className="container">
        <div className={styles.grid}>
          <div ref={contentRef} className={`${styles.content} reveal`}>
            {paragraphs.map((text, index) => (
              <p
                key={text.slice(0, 24)}
                className={styles.paragraph}
                style={{ transitionDelay: `${index * 0.06}s` }}
              >
                {text}
              </p>
            ))}
          </div>

          <div ref={imageRef} className={`${styles.imageWrap} reveal reveal-delay-2`}>
            <div className={styles.imageFrame}>
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                width={image.width}
                height={image.height}
              />
            </div>
            <div className={styles.imageAccent} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
