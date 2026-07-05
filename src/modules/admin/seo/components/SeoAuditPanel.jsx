import AdminIcon from '../../components/AdminIcons';
import styles from './SeoAuditPanel.module.css';

const STATUS_ICON = {
  pass: 'check',
  warn: 'warning',
  fail: 'close',
};

export default function SeoAuditPanel({ page, siteSummary, visible }) {
  if (!visible) return null;

  return (
    <section className={styles.panel} aria-label="SEO audit">
      <div className={styles.header}>
        <h3 className={styles.title}>SEO Audit</h3>
        {siteSummary && (
          <div className={styles.summary}>
            <span className={styles.summaryItem}>
              <AdminIcon name="check" size={14} />
              {siteSummary.pass} passed
            </span>
            <span className={`${styles.summaryItem} ${styles.warn}`}>
              <AdminIcon name="warning" size={14} />
              {siteSummary.warn} warnings
            </span>
            <span className={`${styles.summaryItem} ${styles.fail}`}>
              <AdminIcon name="close" size={14} />
              {siteSummary.fail} failed
            </span>
          </div>
        )}
      </div>

      {page ? (
        <>
          <p className={styles.pageLabel}>
            Auditing <strong>{page.name}</strong>
          </p>
          <ul className={styles.checkList}>
            {page.audit.map((check) => (
              <li key={check.id} className={`${styles.checkItem} ${styles[check.status]}`}>
                <AdminIcon name={STATUS_ICON[check.status]} size={16} />
                <span>{check.label}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className={styles.empty}>Select a page to view audit results.</p>
      )}
    </section>
  );
}
