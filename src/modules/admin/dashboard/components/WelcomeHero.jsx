import { useScrollReveal } from '../../../../hooks/useScrollReveal';
import AdminIcon from '../../components/AdminIcons';
import styles from './WelcomeHero.module.css';

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function WelcomeHero() {
  const revealRef = useScrollReveal(0.1);
  const today = formatDate(new Date());

  return (
    <section ref={revealRef} className={`${styles.hero} reveal`}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.text}>
          <span className={styles.label}>Content Management</span>
          <h1 className={styles.title}>Welcome back, Admin</h1>
          <p className={styles.description}>
            Manage your website content, monitor activity, and keep the ODEH digital presence
            polished — all from one premium control center.
          </p>
          <p className={styles.date}>{today}</p>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.primaryBtn}>
            <AdminIcon name="projects" size={18} />
            Manage Projects
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryBtn}
          >
            <AdminIcon name="external" size={18} />
            Preview Website
          </a>
        </div>
      </div>
    </section>
  );
}
