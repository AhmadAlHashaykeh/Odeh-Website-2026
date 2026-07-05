import styles from './SeoSearchPreview.module.css';

function truncate(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

export default function SeoSearchPreview({ page }) {
  if (!page) return null;

  const displayUrl = `odeh-partners.com${page.route === '/' ? '' : page.route}`;
  const title = page.metaTitle || 'Missing title';
  const description = page.metaDescription || 'Missing meta description.';

  return (
    <section className={styles.previewSection} aria-label="Search preview">
      <h3 className={styles.sectionTitle}>Search Preview</h3>

      <article className={styles.previewCard}>
        <span className={styles.previewLabel}>Google Preview</span>
        <div className={styles.googlePreview}>
          <div className={styles.googleUrl}>{displayUrl}</div>
          <div className={styles.googleTitle}>{truncate(title, 60)}</div>
          <p className={styles.googleDescription}>{truncate(description, 160)}</p>
        </div>
      </article>
    </section>
  );
}
