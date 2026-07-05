/**
 * Section header with a grid of minimal icon cards.
 *
 * @param {Object} props
 * @param {string} [props.id] - Optional section id for anchor links
 * @param {string} props.label - Small uppercase section label
 * @param {string} props.heading - Section heading
 * @param {string} props.description - Introductory paragraph
 * @param {Array<{ label: string, icon: import('react').ReactNode }>} props.items - Icon card entries
 * @param {boolean} [props.showAtmosphere=true] - Toggle decorative grid background
 */
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './IconGridSection.module.css';

export default function IconGridSection({
  id,
  label,
  heading,
  description,
  items,
  showAtmosphere = true,
}) {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal(0.08);

  return (
    <section className={styles.section} id={id}>
      {showAtmosphere && <div className={styles.atmosphere} aria-hidden="true" />}
      <div className="container">
        <div ref={headerRef} className={`${styles.header} reveal`}>
          <span className="section-label">{label}</span>
          <h2 className={styles.heading}>{heading}</h2>
          <p className={styles.description}>{description}</p>
        </div>

        <div ref={gridRef} className={`${styles.cardGrid} reveal reveal-delay-1`}>
          {items.map((item, index) => (
            <article
              key={item.label}
              className={`${styles.card} ${styles.revealCard} reveal-delay-${Math.min(index + 1, 4)}`}
            >
              <span className={styles.iconWrap}>{item.icon}</span>
              <h3 className={styles.cardLabel}>{item.label}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
