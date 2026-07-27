import { StatusBadge } from '../../cms/components';
import styles from './TeamCategoryDetailsDrawer.module.css';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function TeamCategoryDetailsDrawer({ category, onClose }) {
  if (!category) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-category-drawer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Team Category</p>
            <h2 id="team-category-drawer-title" className={styles.title}>
              {category.name}
            </h2>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.preview} style={{ '--preview-border': category.borderColor }}>
            <p className={styles.previewTitle}>{category.name}</p>
            <div className={styles.previewBar} aria-hidden="true" />
            <p className={styles.previewHint}>Border Preview</p>
          </div>

          <dl className={styles.meta}>
            <div>
              <dt>Slug</dt>
              <dd>{category.slug}</dd>
            </div>
            <div>
              <dt>Members</dt>
              <dd>{category.membersCount}</dd>
            </div>
            <div>
              <dt>Display Order</dt>
              <dd>#{category.displayOrder}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <StatusBadge
                  status={category.isActive ? 'published' : 'draft'}
                  label={category.isActive ? 'Active' : 'Inactive'}
                />
              </dd>
            </div>
            <div>
              <dt>Border Color</dt>
              <dd className={styles.colorRow}>
                <span
                  className={styles.swatch}
                  style={{ background: category.borderColor }}
                  aria-hidden="true"
                />
                {category.borderColor}
              </dd>
            </div>
            <div>
              <dt>Last Updated</dt>
              <dd>{formatDate(category.lastUpdated)}</dd>
            </div>
          </dl>

          {category.description ? (
            <section className={styles.section}>
              <h3>Description</h3>
              <p>{category.description}</p>
            </section>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
