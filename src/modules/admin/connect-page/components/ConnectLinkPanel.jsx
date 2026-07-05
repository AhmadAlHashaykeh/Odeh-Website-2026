import AdminIcon from '../../components/AdminIcons';
import { Badge, Button } from '../../ui';
import { CmsModuleShortcut } from '../../cms/components';
import ConnectLinkCard from './ConnectLinkCard';
import styles from './ConnectLinkPanel.module.css';

function HeaderBrandCard({ hero, onEdit, onReset }) {
  return (
    <article className={styles.headerCard}>
      <div className={styles.headerMain}>
        <img src={hero.logoSrc} alt={hero.logoAlt} className={styles.logo} loading="lazy" />
        <div className={styles.headerInfo}>
          <h3 className={styles.headerTitle}>{hero.companyName}</h3>
          <p className={styles.headerDesc}>{hero.description}</p>
          <p className={styles.delegationHint}>
            Logo and company name are managed in Navigation &amp; Footer.
          </p>
        </div>
      </div>
      <div className={styles.shortcuts}>
        <CmsModuleShortcut
          title="Manage Navigation & Footer"
          description="Edit logo, brand name, contact info, and social links."
          path="/admin/navigation-footer"
          icon="navigation"
        />
        <CmsModuleShortcut
          title="Open SEO"
          description="Edit Connect page meta title and description."
          path="/admin/seo"
          icon="seo"
        />
      </div>
      <div className={styles.headerActions}>
        <Button
          variant="primary"
          size="sm"
          icon={<AdminIcon name="edit" size={14} />}
          onClick={onEdit}
        >
          Edit Tagline
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={<AdminIcon name="refresh" size={14} />}
          onClick={onReset}
        >
          Reset Mock Changes
        </Button>
      </div>
    </article>
  );
}

function DelegatedLinksPanel({ panel, links, onPreviewLink, onCopyUrl }) {
  return (
    <>
      <div className={styles.linkCards}>
        {links.map((link) => (
          <ConnectLinkCard
            key={link.id}
            link={link}
            readOnly
            onPreview={onPreviewLink}
            onCopyUrl={onCopyUrl}
          />
        ))}
      </div>
      <CmsModuleShortcut
        title={panel.manageLabel}
        description="Contact and social link URLs are edited in Navigation & Footer."
        path={panel.delegatedTo}
        icon={panel.manageIcon ?? 'navigation'}
      />
    </>
  );
}

export default function ConnectLinkPanel({
  panel,
  links,
  hero,
  onEditHeader,
  onEditLink,
  onPreviewLink,
  onToggleEnabled,
  onCopyUrl,
  onResetLink,
  onResetHeader,
}) {
  const enabledCount = links.filter((link) => link.enabled).length;
  const isDelegated = Boolean(panel.delegatedTo);

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitleRow}>
          <h2 className={styles.panelTitle}>{panel.name}</h2>
          {panel.id !== 'header-brand' && (
            <Badge status="published">
              {enabledCount}/{links.length} enabled
            </Badge>
          )}
        </div>
        <p className={styles.panelDesc}>{panel.description}</p>
      </div>

      {panel.id === 'header-brand' ? (
        <HeaderBrandCard hero={hero} onEdit={onEditHeader} onReset={onResetHeader} />
      ) : isDelegated ? (
        <DelegatedLinksPanel
          panel={panel}
          links={links}
          onPreviewLink={onPreviewLink}
          onCopyUrl={onCopyUrl}
        />
      ) : (
        <div className={styles.linkCards}>
          {links.map((link) => (
            <ConnectLinkCard
              key={link.id}
              link={link}
              onEdit={onEditLink}
              onPreview={onPreviewLink}
              onToggleEnabled={onToggleEnabled}
              onCopyUrl={onCopyUrl}
              onReset={onResetLink}
            />
          ))}
        </div>
      )}
    </section>
  );
}
