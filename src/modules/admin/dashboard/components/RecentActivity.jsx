import { Link } from 'react-router-dom';
import styles from './RecentActivity.module.css';

const recentActivity = [
  { id: '1', label: 'Dashboard stats refreshed from API', time: 'Just now' },
  { id: '2', label: 'CMS modules connected to backend', time: 'Today' },
];

export default function RecentActivity() {
  return (
    <section className={styles.section} aria-labelledby="recent-activity-heading">
      <h2 id="recent-activity-heading" className={styles.title}>Recent Activity</h2>
      <ul className={styles.list}>
        {recentActivity.map((item) => (
          <li key={item.id} className={styles.item}>
            <span>{item.label}</span>
            <span className={styles.time}>{item.time}</span>
          </li>
        ))}
      </ul>
      <Link to="/admin/dashboard" className={styles.link}>View dashboard</Link>
    </section>
  );
}
