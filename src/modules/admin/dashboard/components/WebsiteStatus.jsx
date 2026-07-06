import styles from './WebsiteStatus.module.css';

const websiteStatusItems = [
  { id: 'api', label: 'Admin API', status: 'Connected' },
  { id: 'cms', label: 'CMS Modules', status: 'Live' },
];

export default function WebsiteStatus() {
  return (
    <section className={styles.section} aria-labelledby="website-status-heading">
      <h2 id="website-status-heading" className={styles.title}>Website Status</h2>
      <ul className={styles.list}>
        {websiteStatusItems.map((item) => (
          <li key={item.id} className={styles.item}>
            <span>{item.label}</span>
            <span className={styles.status}>{item.status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
