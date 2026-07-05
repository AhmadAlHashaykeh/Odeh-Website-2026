import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../../../hooks/useScrollReveal';
import AdminIcon from '../../components/AdminIcons';
import { quickActions } from '../mock/dashboardData';
import styles from './QuickActions.module.css';

export default function QuickActions() {
  const headingRef = useScrollReveal(0.1);

  return (
    <section className={styles.section} aria-labelledby="quick-actions-heading">
      <div ref={headingRef} className={`${styles.heading} reveal`}>
        <h2 id="quick-actions-heading" className={styles.title}>Quick Actions</h2>
        <p className={styles.subtitle}>Shortcuts to common CMS tasks</p>
      </div>

      <div className={styles.grid}>
        {quickActions.map((action, index) => (
          <ActionCard key={action.id} action={action} index={index} />
        ))}
      </div>
    </section>
  );
}

function ActionCard({ action, index }) {
  const revealRef = useScrollReveal(0.08);

  return (
    <Link
      ref={revealRef}
      to={action.path}
      className={`${styles.card} reveal`}
      style={{ transitionDelay: `${index * 0.05}s` }}
    >
      <span className={styles.iconWrap}>
        <AdminIcon name={action.icon} size={20} />
      </span>
      <span className={styles.label}>{action.label}</span>
      <AdminIcon name="arrow" size={14} className={styles.arrow} />
    </Link>
  );
}
