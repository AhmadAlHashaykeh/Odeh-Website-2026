import AdminIcon from '../../components/AdminIcons';
import { Badge, Button } from '../../ui';
import styles from './LegalDocumentCard.module.css';

export default function LegalDocumentCard({
  page,
  isActive,
  onEdit,
  onPreview,
  onCopyUrl,
  onReset,
  onSelect,
}) {
  return (
    <article
      className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
      onClick={() => onSelect(page.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(page.id);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
    >
      <div className={styles.header}>
        <div className={styles.iconWrap} aria-hidden="true">
          <AdminIcon name="legal" size={20} />
        </div>
        <div className={styles.titleBlock}>
          <h2 className={styles.title}>{page.title}</h2>
          <code className={styles.slug}>/{page.slug}</code>
        </div>
      </div>

      <div className={styles.badges}>
        <Badge status={page.publicationStatus}>{page.publicationStatus}</Badge>
        <span className={styles.seoBadge}>{page.seoStatus}</span>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Last updated</span>
          <span className={styles.metaValue}>{page.lastUpdated}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Reading time</span>
          <span className={styles.metaValue}>{page.readingTimeMinutes} min</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Sections</span>
          <span className={styles.metaValue}>{page.sections.length}</span>
        </div>
      </div>

      <p className={styles.preview}>{page.contentPreview}</p>

      <div className={styles.actions} onClick={(event) => event.stopPropagation()}>
        <Button
          variant="primary"
          size="sm"
          icon={<AdminIcon name="edit" size={14} />}
          onClick={() => onEdit(page.id)}
        >
          Edit
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={<AdminIcon name="eye" size={14} />}
          onClick={() => onPreview(page.id)}
        >
          Preview
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={<AdminIcon name="copy" size={14} />}
          onClick={() => onCopyUrl(page.path)}
        >
          Copy URL
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={<AdminIcon name="refresh" size={14} />}
          onClick={() => onReset(page.id)}
        >
          Reset
        </Button>
      </div>
    </article>
  );
}
