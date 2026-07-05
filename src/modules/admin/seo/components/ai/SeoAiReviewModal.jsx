import AdminIcon from '../../../components/AdminIcons';
import { Modal, Button } from '../../../ui';
import drawerStyles from '../../../cms/action-flows/AdminFormDrawer.module.css';
import SeoAiBadge from './SeoAiBadge';
import styles from './SeoAiReviewModal.module.css';

function CompareColumn({ title, metaTitle, metaDescription, variant = 'current' }) {
  return (
    <div className={`${styles.column} ${styles[variant]}`}>
      <h3 className={styles.columnTitle}>{title}</h3>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Meta Title</span>
        <p className={styles.fieldValue}>{metaTitle || '—'}</p>
      </div>
      <div className={styles.field}>
        <span className={styles.fieldLabel}>Meta Description</span>
        <p className={styles.fieldValue}>{metaDescription || '—'}</p>
      </div>
    </div>
  );
}

export default function SeoAiReviewModal({
  open,
  page,
  optimization,
  isLoading,
  onClose,
  onApply,
  onCopy,
  onRegenerate,
}) {
  if (!open || !page) return null;

  const modalHeader = (
    <div className={drawerStyles.modalHeader}>
      <div className={drawerStyles.headerContent}>
        <div className={drawerStyles.headerMeta}>
          <span className={drawerStyles.headerIcon} aria-hidden="true">
            <AdminIcon name="seo" size={18} />
          </span>
          <SeoAiBadge label="AI Optimization Preview" variant="info" />
        </div>
        <h2 id="seo-ai-review-title" className={drawerStyles.modalTitle}>
          Review AI Optimization
        </h2>
        <p className={drawerStyles.modalSubtitle}>
          Compare current metadata with AI-optimized suggestions for <strong>{page.name}</strong>.
        </p>
      </div>
      <button type="button" className={drawerStyles.closeBtn} onClick={onClose} aria-label="Close">
        <AdminIcon name="close" size={18} />
      </button>
    </div>
  );

  const modalFooter = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button
        variant="ghost"
        icon={<AdminIcon name="copy" size={14} />}
        onClick={onCopy}
        disabled={!optimization || isLoading}
      >
        Copy Optimized Text
      </Button>
      <Button
        variant="ghost"
        icon={<AdminIcon name="refresh" size={14} />}
        onClick={onRegenerate}
        disabled={isLoading}
      >
        Regenerate
      </Button>
      <Button
        variant="primary"
        icon={<AdminIcon name="check" size={16} />}
        onClick={onApply}
        disabled={!optimization || isLoading}
      >
        Apply Optimization
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="form"
      scrollable
      header={modalHeader}
      footer={modalFooter}
      ariaLabelledBy="seo-ai-review-title"
    >
      <div className={styles.body}>
        {isLoading && !optimization ? (
          <p className={styles.loading}>Generating optimization review…</p>
        ) : optimization ? (
          <>
            <div className={styles.scoreBanner}>
              <div className={styles.scoreItem}>
                <span className={styles.scoreLabel}>Estimated score</span>
                <span className={styles.scoreValue}>{optimization.estimatedScore}%</span>
              </div>
              {optimization.scoreImprovement > 0 && (
                <div className={styles.scoreItem}>
                  <span className={styles.scoreLabel}>Improvement</span>
                  <span className={styles.scoreGain}>+{optimization.scoreImprovement}%</span>
                </div>
              )}
            </div>

            <div className={styles.compareGrid}>
              <CompareColumn
                title="Current SEO"
                metaTitle={page.metaTitle}
                metaDescription={page.metaDescription}
                variant="current"
              />
              <CompareColumn
                title="AI Optimized SEO"
                metaTitle={optimization.metaTitle}
                metaDescription={optimization.metaDescription}
                variant="optimized"
              />
            </div>

            {optimization.focusKeywords?.length > 0 && (
              <div className={styles.keywordsSection}>
                <span className={styles.sectionLabel}>Suggested Keywords</span>
                <div className={styles.keywords}>
                  {optimization.focusKeywords.map((keyword) => (
                    <span key={keyword} className={styles.keyword}>
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className={styles.note}>
              Applying updates the page metadata in preview state. Save draft or edit further before publishing.
            </p>
          </>
        ) : null}
      </div>
    </Modal>
  );
}
