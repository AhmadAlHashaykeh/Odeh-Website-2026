import AdminIcon from '../../components/AdminIcons';
import styles from './GlobalCtaNotice.module.css';

export default function GlobalCtaNotice() {
  return (
    <aside className={styles.card}>
      <div className={styles.iconWrap} aria-hidden="true">
        <AdminIcon name="services" size={18} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>No Global CTA Component</h3>
        <p className={styles.text}>
          This website does not currently use a global CTA component. Page-level CTAs are managed
          within their respective CMS modules (Home Page, About Pages, etc.).
        </p>
      </div>
    </aside>
  );
}
