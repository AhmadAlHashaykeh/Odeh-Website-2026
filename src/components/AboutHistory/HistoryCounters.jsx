import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useCountUp } from '../../hooks/useCountUp';
import styles from './HistoryCounters.module.css';

function CounterItem({ item, index }) {
  const ref = useScrollReveal(0.12);
  const countUp = useCountUp(item.value, { duration: 2000 + index * 150 });

  return (
    <article
      ref={ref}
      className={`${styles.item} reveal`}
      style={{ transitionDelay: `${index * 0.12}s` }}
    >
      <span ref={countUp.ref} className={styles.value}>
        {countUp.display}
      </span>
      <span className={styles.label}>{item.label}</span>
      {index === 0 && <span className={styles.divider} aria-hidden="true" />}
    </article>
  );
}

export default function HistoryCounters({ items }) {
  const sectionRef = useScrollReveal(0.1);

  return (
    <section className={styles.counters} aria-label="Company statistics">
      <div className="container">
        <div ref={sectionRef} className={`${styles.strip} reveal`}>
          {items.map((item, index) => (
            <CounterItem key={item.label} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
