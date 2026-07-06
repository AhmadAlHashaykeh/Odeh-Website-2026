import AdminIcon from '../../components/AdminIcons';
import { Badge, Button } from '../../ui';
import { getPanelSummary } from '../mock/navigationFooterConfig';
import styles from './NavigationFooterContentPanel.module.css';

function NavLogoPreview({ data }) {
  return (
    <div className={styles.logoPreview}>
      <div className={styles.miniNavbar}>
        <img src={resolveMediaUrl(data.src)} alt={data.alt} className={styles.logoImg} loading="lazy" />
        <div className={styles.miniNavLinks}>
          <span className={styles.miniNavLink}>Home</span>
          <span className={styles.miniNavLinkActive}>About us</span>
          <span className={styles.miniNavLink}>Projects</span>
        </div>
      </div>
    </div>
  );
}

function NavMenuPreview({ data }) {
  return (
    <div className={styles.navMenuPreview}>
      <div className={styles.miniNavbarFull}>
        {data.map((item) => (
          <span
            key={item.id}
            className={`${styles.miniNavPill} ${item.hasDropdown ? styles.miniNavPillDropdown : ''}`}
          >
            {item.label}
            {item.hasDropdown && <span className={styles.miniChevron}>▾</span>}
          </span>
        ))}
        <span className={styles.miniSearch} aria-hidden="true">
          <AdminIcon name="search" size={12} />
        </span>
      </div>
      {data.some((item) => item.hasDropdown) && (
        <div className={styles.dropdownPreview}>
          {data
            .find((item) => item.hasDropdown)
            ?.dropdown.map((sub) => (
              <span key={sub.id} className={styles.dropdownItem}>
                {sub.label}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}

function FooterBrandPreview({ data }) {
  return (
    <div className={styles.footerBrandPreview}>
      <img src={resolveMediaUrl(data.logo.src)} alt={data.logo.alt} className={styles.footerLogo} loading="lazy" />
      <p className={styles.footerBrandText}>{data.text.slice(0, 120)}…</p>
    </div>
  );
}

function FooterNavGroupPreview({ data }) {
  return (
    <div className={styles.footerNavPreview}>
      <h4 className={styles.footerNavTitle}>{data.title}</h4>
      <ul className={styles.footerNavList}>
        {data.links.map((link) => (
          <li key={link.path}>
            <span className={styles.footerNavArrow}>→</span>
            {link.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterContactPreview({ data }) {
  return (
    <div className={styles.footerContactPreview}>
      <h4 className={styles.footerNavTitle}>Reach Us</h4>
      {data.contacts.slice(0, 2).map((contact) => (
        <div key={contact.email} className={styles.footerContactRow}>
          <span className={styles.footerContactEmail}>{contact.email}</span>
          <span className={styles.footerContactPhone}>{contact.phone}</span>
        </div>
      ))}
      {data.contacts.length > 2 && (
        <span className={styles.moreHint}>+{data.contacts.length - 2} more contacts</span>
      )}
      <div className={styles.footerLocation}>
        <span className={styles.footerLocationLabel}>Location</span>
        <span>{data.location}</span>
      </div>
    </div>
  );
}

function FooterCopyrightPreview({ data }) {
  return (
    <div className={styles.copyrightPreview}>
      <p className={styles.copyrightText}>
        &copy; {new Date().getFullYear()} {data.companyName}
      </p>
    </div>
  );
}

function ContactOfficePreview({ data }) {
  return (
    <div className={styles.contactCardPreview}>
      <div className={styles.contactCardHeader}>
        <span className={styles.contactCardIcon} aria-hidden="true">
          <AdminIcon name="connect" size={14} />
        </span>
        <span className={styles.contactCardLabel}>Office</span>
      </div>
      <p className={styles.contactCardPrimary}>{data.officeName}</p>
      <p className={styles.contactCardSecondary}>{data.location}</p>
      <div className={styles.contactCardDivider} aria-hidden="true" />
      <div className={styles.contactCardHeader}>
        <span className={styles.contactCardIcon} aria-hidden="true">
          <AdminIcon name="activities" size={14} />
        </span>
        <span className={styles.contactCardLabel}>Working Hours</span>
      </div>
      <p className={styles.contactCardPrimary}>{data.workingHours.days}</p>
      <p className={styles.contactCardSecondary}>{data.workingHours.hours}</p>
    </div>
  );
}

function ContactDirectPreview({ data }) {
  return (
    <div className={styles.contactDirectPreview}>
      {data.map((contact) => (
        <div key={contact.email} className={styles.contactDirectRow}>
          <span className={styles.contactDirectName}>{contact.email.split('@')[0]}</span>
          <span className={styles.contactDirectEmail}>{contact.email}</span>
          <span className={styles.contactDirectPhone}>{contact.phone}</span>
        </div>
      ))}
    </div>
  );
}

function SocialLinkPreview({ data }) {
  const iconName = data.icon === 'facebook' || data.icon === 'instagram' || data.icon === 'linkedin'
    ? 'external'
    : 'external';

  return (
    <div className={styles.socialPreview}>
      <div className={styles.socialIconRow}>
        <span className={styles.socialIconBadge}>{data.label.charAt(0)}</span>
        <span className={styles.socialPlatform}>{data.label}</span>
      </div>
      <span className={styles.socialUrl}>{data.href}</span>
      <span className={styles.socialStatus}>
        <AdminIcon name={iconName} size={12} />
        Active
      </span>
    </div>
  );
}

function PanelPreview({ type, data }) {
  if (!data) return null;

  switch (type) {
    case 'nav-logo':
      return <NavLogoPreview data={data} />;
    case 'nav-menu':
      return <NavMenuPreview data={data} />;
    case 'footer-brand':
      return <FooterBrandPreview data={data} />;
    case 'footer-nav-group':
      return <FooterNavGroupPreview data={data} />;
    case 'footer-contact':
      return <FooterContactPreview data={data} />;
    case 'footer-copyright':
      return <FooterCopyrightPreview data={data} />;
    case 'contact-office':
      return <ContactOfficePreview data={data} />;
    case 'contact-direct':
      return <ContactDirectPreview data={data} />;
    case 'social-link':
      return <SocialLinkPreview data={data} />;
    default:
      return null;
  }
}

export default function NavigationFooterContentPanel({
  panel,
  panelData,
  onEdit,
  onPreview,
  onReset,
  onEditNavItem,
  onPreviewSocial,
}) {
  const summary = getPanelSummary(panel.id, panelData);
  const isNavMenu = panel.id === 'nav-menu';

  return (
    <article className={styles.panel}>
      <div className={styles.panelMain}>
        <div className={styles.panelHeader}>
          <div className={styles.panelTitleRow}>
            <h2 className={styles.panelTitle}>{panel.name}</h2>
            <Badge status={panel.status}>{panel.status}</Badge>
          </div>
          <p className={styles.panelDesc}>{panel.description}</p>
        </div>

        {isNavMenu && Array.isArray(panelData) ? (
          <div className={styles.navItemsList}>
            <span className={styles.summaryLabel}>Navigation Items</span>
            {panelData.map((item) => (
              <div key={item.id} className={styles.navItemCard}>
                <div className={styles.navItemInfo}>
                  <div className={styles.navItemHeader}>
                    <span className={styles.navItemOrder}>#{item.order}</span>
                    <strong className={styles.navItemLabel}>{item.label}</strong>
                    <Badge status={item.status}>{item.status}</Badge>
                  </div>
                  <div className={styles.navItemMeta}>
                    <span className={styles.navItemRoute}>{item.path}</span>
                    {item.hasDropdown && (
                      <span className={styles.navItemDropdown}>
                        {item.dropdown.length} dropdown links
                      </span>
                    )}
                  </div>
                  {item.hasDropdown && (
                    <ul className={styles.dropdownList}>
                      {item.dropdown.map((sub) => (
                        <li key={sub.id} className={styles.dropdownListItem}>
                          <span className={styles.dropdownOrder}>{sub.order}.</span>
                          {sub.label}
                          <span className={styles.dropdownPath}>{sub.path}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className={styles.navItemActions}>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<AdminIcon name="edit" size={14} />}
                    onClick={() => onEditNavItem?.(panel.id, item.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<AdminIcon name="eye" size={14} />}
                    onClick={() => onPreview(item.path)}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.summaryBlock}>
            <span className={styles.summaryLabel}>Content Summary</span>
            <p className={styles.summaryText}>{summary}</p>
          </div>
        )}

        <div className={styles.actions}>
          {!isNavMenu && (
            <Button
              variant="primary"
              size="sm"
              icon={<AdminIcon name="edit" size={14} />}
              onClick={() => onEdit(panel.id)}
            >
              Edit
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={<AdminIcon name="eye" size={14} />}
            onClick={() => {
              if (panel.previewType === 'social-link' && panelData?.href) {
                onPreviewSocial?.(panelData.href);
              } else {
                onPreview(panel.anchor);
              }
            }}
          >
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<AdminIcon name="refresh" size={14} />}
            onClick={() => onReset(panel.id)}
          >
            Reset Mock Changes
          </Button>
        </div>
      </div>

      <div className={styles.previewArea}>
        <span className={styles.previewAreaLabel}>Content Preview</span>
        <PanelPreview type={panel.previewType} data={panelData} />
      </div>
    </article>
  );
}
