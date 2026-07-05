/**
 * Horizontal highlight strip for key facts or metrics.
 *
 * @param {Object} props
 * @param {string} [props.ariaLabel] - Accessible section label
 * @param {Array<{ value: string, label: string }>} props.items - Highlight entries
 */
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './HighlightStrip.module.css';

export default function HighlightStrip({ ariaLabel = 'Highlights', items }) {
  const stripRef = useScrollReveal(0.12);

  return (
    <section className={styles.stripSection} aria-label={ariaLabel}>
      <div className="container">
        <div ref={stripRef} className={`${styles.strip} reveal`}>
          {items.map((item, index) => (
            <div
              key={item.value}
              className={`${styles.item} reveal-delay-${Math.min(index + 1, 4)}`}
            >
              <span className={styles.value}>{item.value}</span>
              <span className={styles.label}>{item.label}</span>
              {index < items.length - 1 && (
                <span className={styles.divider} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
