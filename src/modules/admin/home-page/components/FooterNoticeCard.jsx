import AdminIcon from '../../components/AdminIcons';
import styles from './FooterNoticeCard.module.css';

export default function FooterNoticeCard() {
  return (
    <aside className={styles.card}>
      <div className={styles.iconWrap} aria-hidden="true">
        <AdminIcon name="navigation" size={18} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>Footer & Global Navigation</h3>
        <p className={styles.text}>
          Footer content is managed under Navigation &amp; Footer. The homepage uses the shared site
          footer and does not own that content directly.
        </p>
      </div>
    </aside>
  );
}
