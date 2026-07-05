import AdminIcon from '../../components/AdminIcons';
import { Drawer, Button } from '../../ui';
import { getSectionBody } from '../mock/legalPagesConfig';
import styles from './LegalPagePreviewDrawer.module.css';

function SectionContent({ page, section }) {
  const { paragraphs, listItems } = getSectionBody(page, section.id);

  return (
    <section className={styles.section} id={section.id}>
      <h3 className={styles.sectionTitle}>{section.title}</h3>
      {paragraphs.map((text) => (
        <p key={text.slice(0, 32)} className={styles.paragraph}>
          {text}
        </p>
      ))}
      {listItems?.length > 0 && (
        <ul className={styles.list}>
          {listItems.map((item) => (
            <li key={item.slice(0, 32)}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function LegalPagePreviewDrawer({ page, onClose, onPreviewWebsite }) {
  if (!page) return null;

  const drawerHeader = (
    <Drawer.Header onClose={onClose} sticky>
      <div className={styles.drawerHeaderContent}>
        <span className={styles.drawerLabel}>{page.hero.label}</span>
        <h2 className={styles.drawerTitle}>{page.title}</h2>
        <p className={styles.drawerSubtitle}>{page.hero.description}</p>
      </div>
    </Drawer.Header>
  );

  const drawerFooter = (
    <Drawer.Footer>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
      <Button
        variant="primary"
        icon={<AdminIcon name="external" size={14} />}
        onClick={() => onPreviewWebsite(page.path)}
      >
        Open on Website
      </Button>
    </Drawer.Footer>
  );

  return (
    <Drawer
      open={Boolean(page)}
      onClose={onClose}
      size="large"
      stickyHeader
      header={drawerHeader}
      footer={drawerFooter}
    >
      <div className={styles.content}>
        <div className={styles.heroCard}>
          <span className={styles.heroLabel}>{page.hero.label}</span>
          <h3 className={styles.heroTitle}>{page.hero.title}</h3>
          <p className={styles.heroDescription}>{page.hero.description}</p>
          <div className={styles.heroMeta}>
            <span>Last updated: {page.lastUpdated}</span>
            <span>{page.readingTimeMinutes} min read</span>
            <span>{page.sections.length} sections</span>
          </div>
        </div>

        <section className={styles.metaSection}>
          <h3 className={styles.blockTitle}>Metadata</h3>
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Slug</span>
              <code className={styles.metaValue}>/{page.slug}</code>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Route</span>
              <code className={styles.metaValue}>{page.path}</code>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Publication</span>
              <span className={styles.metaValue}>{page.publicationStatus}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>SEO Status</span>
              <span className={styles.metaValue}>{page.seoStatus}</span>
            </div>
          </div>
        </section>

        <section className={styles.metaSection}>
          <h3 className={styles.blockTitle}>SEO</h3>
          <div className={styles.seoBlock}>
            <div>
              <span className={styles.metaLabel}>Meta Title</span>
              <p className={styles.seoText}>{page.meta.title}</p>
            </div>
            <div>
              <span className={styles.metaLabel}>Meta Description</span>
              <p className={styles.seoText}>{page.meta.description}</p>
            </div>
          </div>
        </section>

        <section className={styles.documentBody}>
          <h3 className={styles.blockTitle}>Document Content</h3>
          {page.sections.map((section) => (
            <SectionContent key={section.id} page={page} section={section} />
          ))}
        </section>

        <section className={styles.metaSection}>
          <h3 className={styles.blockTitle}>Internal Links</h3>
          {page.internalLinks.length > 0 ? (
            <ul className={styles.linkList}>
              {page.internalLinks.map((link) => (
                <li key={`${link.path}-${link.source}`} className={styles.linkItem}>
                  <span className={styles.linkLabel}>{link.label}</span>
                  <code className={styles.linkPath}>{link.path}</code>
                  <span className={styles.linkSource}>{link.source}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyLinks}>No internal references found.</p>
          )}
        </section>
      </div>
    </Drawer>
  );
}
