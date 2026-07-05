import AdminIcon from '../../components/AdminIcons';
import { Button } from '../../ui';
import { getScoreLabel, getScoreTone } from '../utils/seoAudit';
import SeoSearchPreview from './SeoSearchPreview';
import SeoOverflowMenu from './SeoOverflowMenu';
import styles from './SeoInspector.module.css';

function InspectorField({ label, value, missing = false }) {
  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={`${styles.fieldValue} ${missing ? styles.missing : ''}`}>
        {missing ? 'Missing' : value}
      </span>
    </div>
  );
}

function InspectorSection({ title, children }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.fieldGrid}>{children}</div>
    </section>
  );
}

export default function SeoInspector({
  page,
  onEdit,
  onPreview,
  onCopyUrl,
  onOpenPage,
  onReset,
}) {
  if (!page) {
    return (
      <div className={styles.inspector}>
        <p className={styles.empty}>Select a page to inspect SEO metadata.</p>
      </div>
    );
  }

  const scoreTone = getScoreTone(page.seoScore);

  const overflowItems = [
    { id: 'copy-url', label: 'Copy URL', icon: 'copy', onClick: () => onCopyUrl(page.route) },
    { id: 'open-page', label: 'Open Page', icon: 'external', onClick: () => onOpenPage(page.route) },
    { id: 'reset', label: 'Reset Changes', icon: 'refresh', onClick: () => onReset(page.id), danger: true },
  ];

  return (
    <div className={styles.inspector}>
      <div className={styles.inspectorHeader}>
        <div className={styles.headerMain}>
          <h2 className={styles.pageTitle}>{page.name}</h2>
          <span className={`${styles.scoreBadge} ${styles[scoreTone]}`}>
            {page.seoScore}% · {getScoreLabel(page.seoScore)}
          </span>
        </div>

        <div className={styles.quickActions}>
          <Button variant="primary" size="sm" icon={<AdminIcon name="edit" size={14} />} onClick={() => onEdit(page.id)}>
            Edit SEO
          </Button>
          <Button variant="secondary" size="sm" icon={<AdminIcon name="eye" size={14} />} onClick={() => onPreview(page.route)}>
            Preview
          </Button>
          <SeoOverflowMenu items={overflowItems} ariaLabel={`More actions for ${page.name}`} />
        </div>
      </div>

      <div className={styles.inspectorBody}>
        <InspectorSection title="Page">
          <InspectorField label="Page Name" value={page.name} />
          <InspectorField label="Route" value={page.route} />
          <InspectorField label="Page Type" value={page.pageType} />
        </InspectorSection>

        <InspectorSection title="Metadata">
          <InspectorField label="Meta Title" value={page.metaTitle} missing={!page.metaTitle} />
          <InspectorField label="Meta Description" value={page.metaDescription} missing={!page.metaDescription} />
        </InspectorSection>
      </div>

      <SeoSearchPreview page={page} />
    </div>
  );
}
