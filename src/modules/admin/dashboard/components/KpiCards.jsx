import { useMemo, useState } from 'react';
import { useScrollReveal } from '../../../../hooks/useScrollReveal';
import AdminIcon from '../../components/AdminIcons';
import { useCounterAnimation } from '../../hooks/useCounterAnimation';
import { useDashboardStats } from '../hooks/useDashboardStats';
import styles from './KpiCards.module.css';

function KpiCard({ card, index }) {
  const [count, countRef] = useCounterAnimation(card.value);
  const revealRef = useScrollReveal(0.1);

  return (
    <article
      ref={revealRef}
      className={`${styles.card} ${styles[card.accent]} reveal`}
      style={{ transitionDelay: `${index * 0.08}s` }}
    >
      <div className={styles.iconWrap}>
        <AdminIcon name={card.icon} size={22} />
      </div>
      <div className={styles.content}>
        <span ref={countRef} className={styles.value}>{count}</span>
        <span className={styles.label}>{card.label}</span>
        <span className={styles.helper}>{card.helper}</span>
      </div>
      <div className={styles.accentBorder} aria-hidden="true" />
    </article>
  );
}

export default function KpiCards() {
  const { kpiCards, isLoading } = useDashboardStats();
  const cards = useMemo(() => (isLoading ? [] : kpiCards), [isLoading, kpiCards]);

  if (isLoading) {
    return (
      <section className={styles.section} aria-label="Key performance indicators">
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={`${styles.card} ${styles.skeleton}`} aria-hidden="true" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-label="Key performance indicators">
      <div className={styles.grid}>
        {cards.map((card, index) => (
          <KpiCard key={card.id} card={card} index={index} />
        ))}
      </div>
    </section>
  );
}
