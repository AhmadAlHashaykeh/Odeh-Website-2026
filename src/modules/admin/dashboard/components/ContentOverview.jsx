import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../../../hooks/useScrollReveal';
import AdminIcon from '../../components/AdminIcons';
import { useDashboardStats } from '../hooks/useDashboardStats';
import styles from './ContentOverview.module.css';

export default function ContentOverview() {
  const { contentOverviewCards, isLoading } = useDashboardStats();
  const headingRef = useScrollReveal(0.1);

  return (
    <section className={styles.section} aria-labelledby="content-overview-heading">
      <div ref={headingRef} className={`${styles.heading} reveal`}>
        <h2 id="content-overview-heading" className={styles.title}>Content Overview</h2>
        <p className={styles.subtitle}>Quick access to content modules on the public website</p>
      </div>

      <div className={styles.grid}>
        {(isLoading ? [] : contentOverviewCards).map((card, index) => (
          <ContentCard key={card.id} card={card} index={index} />
        ))}
      </div>
    </section>
  );
}

function ContentCard({ card, index }) {
  const revealRef = useScrollReveal(0.08);

  return (
    <article
      ref={revealRef}
      className={`${styles.card} reveal`}
      style={{ transitionDelay: `${index * 0.06}s` }}
    >
      <div className={styles.cardHeader}>
        <div className={styles.iconWrap}>
          <AdminIcon name={card.icon} size={20} />
        </div>
      </div>

      <h3 className={styles.cardTitle}>{card.title}</h3>
      <p className={styles.cardDescription}>{card.description}</p>

      <div className={styles.cardFooter}>
        <span className={styles.count}>
          <strong>{card.count}</strong> items
        </span>
        <Link to={card.path} className={styles.manageBtn}>
          Manage
          <AdminIcon name="arrow" size={14} />
        </Link>
      </div>
    </article>
  );
}
