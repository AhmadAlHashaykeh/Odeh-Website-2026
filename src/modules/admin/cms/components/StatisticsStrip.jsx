import styles from './StatisticsStrip.module.css';

export default function StatisticsStrip({ statistics = [] }) {
  return (
    <div className={styles.strip} role="region" aria-label="Statistics overview">
      {statistics.map((stat) => (
        <div key={stat.id} className={styles.card}>
          <span className={styles.value}>{stat.value}</span>
          <span className={styles.label}>{stat.label}</span>
          {stat.helper && <span className={styles.helper}>{stat.helper}</span>}
        </div>
      ))}
    </div>
  );
}
