import { useScrollReveal } from '../../../../hooks/useScrollReveal';
import AdminIcon from '../../components/AdminIcons';
import { websiteStatusItems } from '../mock/dashboardData';
import styles from './WebsiteStatus.module.css';

export default function WebsiteStatus() {
  const revealRef = useScrollReveal(0.1);

  const completeCount = websiteStatusItems.filter((item) => item.status === 'complete').length;
  const totalCount = websiteStatusItems.length;
  const progress = Math.round((completeCount / totalCount) * 100);

  return (
    <section ref={revealRef} className={`${styles.section} reveal`} aria-labelledby="website-status-heading">
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h2 id="website-status-heading" className={styles.title}>Website Status</h2>
            <p className={styles.subtitle}>CMS readiness and project progress</p>
          </div>
          <div className={styles.progressRing} aria-label={`${progress}% complete`}>
            <svg viewBox="0 0 64 64" className={styles.progressSvg}>
              <circle cx="32" cy="32" r="28" className={styles.progressTrack} />
              <circle
                cx="32"
                cy="32"
                r="28"
                className={styles.progressFill}
                style={{ strokeDashoffset: 175.9 - (175.9 * progress) / 100 }}
              />
            </svg>
            <span className={styles.progressValue}>{progress}%</span>
          </div>
        </div>

        <ul className={styles.list}>
          {websiteStatusItems.map((item) => (
            <li key={item.id} className={styles.item}>
              <span className={`${styles.statusIcon} ${styles[item.status]}`}>
                <AdminIcon
                  name={item.status === 'complete' ? 'check' : 'warning'}
                  size={14}
                  strokeWidth={2.5}
                />
              </span>
              <span className={styles.itemLabel}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
