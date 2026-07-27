/**
 * Internal page hero for About sub-pages (~40–50vh).
 *
 * @param {Object} props
 * @param {string} props.label - Small uppercase section label (e.g. "About Us")
 * @param {string} props.title - Main page heading
 * @param {string} props.description - Supporting paragraph
 * @param {string} props.backgroundImage - Background image URL
 * @param {string} [props.ariaLabel] - Accessible section label
 */
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './PageHero.module.css';

export default function PageHero({
  label,
  title,
  description,
  backgroundImage,
  ariaLabel,
}) {
  const contentRef = useScrollReveal(0.12);

  return (
    <section className={styles.hero} aria-label={ariaLabel ?? title}>
      <div className={styles.background}>
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className={styles.bgImage}
          fetchpriority="high"
          decoding="async"
          width={1400}
          height={900}
        />
        <div className={styles.overlay} />
        <div className={styles.gridLines} aria-hidden="true" />
      </div>

      <div className={`container ${styles.layout}`}>
        <div ref={contentRef} className={`${styles.content} reveal`}>
          <span className="section-label">{label}</span>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </section>
  );
}
