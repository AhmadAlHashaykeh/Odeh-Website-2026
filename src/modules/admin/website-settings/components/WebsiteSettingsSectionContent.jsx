import { Link } from 'react-router-dom';
import AdminIcon from '../../components/AdminIcons';
import WebsiteSettingCard from './WebsiteSettingCard';
import WebsiteShortcutCard from './WebsiteShortcutCard';
import { websiteSettingsShortcuts } from '../mock/websiteSettingsConfig';
import { resolveMediaUrl } from '../../../../utils/mediaUrl';
import styles from './WebsiteSettingsSectionContent.module.css';

function LogoPreview({ logo }) {
  return (
    <div className={styles.logoPreview}>
      <img src={resolveMediaUrl(logo.src)} alt={logo.alt} loading="lazy" />
    </div>
  );
}

function FaviconPreview({ favicon }) {
  return (
    <div className={styles.faviconPreview}>
      <img src={resolveMediaUrl(favicon.src)} alt="" loading="lazy" aria-hidden="true" />
    </div>
  );
}

function SectionGroup({ title, children }) {
  return (
    <section className={styles.group}>
      {title && <h2 className={styles.groupTitle}>{title}</h2>}
      <div className={styles.groupCards}>{children}</div>
    </section>
  );
}

function GeneralSection({ settings, onEdit }) {
  return (
    <>
      <SectionGroup title="Site Identity">
        <WebsiteSettingCard
          title="General Settings"
          description="Global site name, description, and default language used across the public website."
          fields={[
            { label: 'Website Name', value: settings.general.websiteName },
            { label: 'Website Description', value: settings.general.websiteDescription },
            { label: 'Default Language', value: settings.general.defaultLanguage },
          ]}
          editable
          onEdit={() => onEdit('general-identity')}
        />
        <WebsiteSettingCard
          title="Copyright"
          description="Footer copyright company name displayed on every page."
          fields={[
            {
              label: 'Company Name',
              value: settings.general.copyrightCompanyName,
            },
            {
              label: 'Year',
              value: `© ${new Date().getFullYear()} (dynamic)`,
            },
          ]}
          managedNote="Managed in Navigation & Footer — edit copyright details there."
        />
      </SectionGroup>

      <SectionGroup title="Related Modules">
        <div className={styles.shortcutGrid}>
          {websiteSettingsShortcuts.map((shortcut) => (
            <WebsiteShortcutCard key={shortcut.id} shortcut={shortcut} />
          ))}
        </div>
      </SectionGroup>
    </>
  );
}

function BrandingSection({ settings, onEdit }) {
  return (
    <SectionGroup title="Brand Assets">
      <WebsiteSettingCard
        title="Site Logo"
        description="Primary logo used in the navigation bar and site footer."
        fields={[
          { label: 'Source', value: settings.branding.logo.src, mono: true },
          { label: 'Alt Text', value: settings.branding.logo.alt },
        ]}
        preview={<LogoPreview logo={settings.branding.logo} />}
        managedNote="Managed in Navigation & Footer — logo editing is not duplicated here."
      />
      <WebsiteSettingCard
        title="Favicon"
        description="Browser tab icon defined in index.html."
        fields={[
          { label: 'Source', value: settings.branding.favicon.src, mono: true },
          { label: 'Type', value: settings.branding.favicon.type },
        ]}
        preview={<FaviconPreview favicon={settings.branding.favicon} />}
        editable
        onEdit={() => onEdit('branding-favicon')}
      />
      <WebsiteSettingCard
        title="Brand Name"
        description="Official company name used in Connect page header and brand touchpoints."
        fields={[{ label: 'Brand Name', value: settings.branding.brandName }]}
        managedNote="Managed in Connect Page and Navigation & Footer."
      />
      <WebsiteSettingCard
        title="Primary Brand Assets"
        description="Hero media and typography used on the public website."
        fields={[
          { label: 'Primary Font', value: settings.branding.primaryFont },
          { label: 'Hero Poster', value: settings.branding.heroPoster, mono: true },
          { label: 'Hero Video', value: settings.branding.heroVideo, mono: true },
        ]}
        managedNote="Hero assets are managed in Home Page CMS. Font is defined in global.css."
      />
      <Link to="/admin/home-page" className={styles.manageLink}>
        <AdminIcon name="home" size={14} />
        Manage Home Page Assets
      </Link>
    </SectionGroup>
  );
}

function ContactSection({ settings }) {
  const { contact } = settings;

  return (
    <SectionGroup title="Office Contact">
      <WebsiteSettingCard
        title="Office"
        description="Primary office information displayed in the site footer and contact sections."
        fields={[
          { label: 'Office Name', value: contact.officeName },
          { label: 'Address', value: contact.location },
        ]}
        managedNote="Managed in Navigation & Footer — contact panels."
      />
      <WebsiteSettingCard
        title="Working Hours"
        description="Business hours shown alongside office contact details."
        fields={[
          { label: 'Days', value: contact.workingHours.days },
          { label: 'Hours', value: contact.workingHours.hours },
        ]}
        managedNote="Managed in Navigation & Footer."
      />
      <WebsiteSettingCard
        title="Direct Contacts"
        description="Email and phone contacts listed in the footer contact section."
        fields={contact.contacts.flatMap((entry, index) => [
          { label: `Contact ${index + 1} Email`, value: entry.email },
          { label: `Contact ${index + 1} Phone`, value: entry.phone },
        ])}
        managedNote="Managed in Navigation & Footer — direct contact panel."
      />
      <Link to="/admin/navigation-footer" className={styles.manageLink}>
        <AdminIcon name="navigation" size={14} />
        Manage Contact Information
      </Link>
    </SectionGroup>
  );
}

function LocalizationSection({ settings, onEdit }) {
  return (
    <SectionGroup title="Language Configuration">
      <aside className={styles.notice}>
        <div className={styles.noticeIcon} aria-hidden="true">
          <AdminIcon name="about" size={18} />
        </div>
        <div>
          <h3 className={styles.noticeTitle}>Multi-language not supported</h3>
          <p className={styles.noticeText}>
            This project does not include an i18n framework, translation files, or a language
            switcher. Only a single default language is configured for the public website.
          </p>
        </div>
      </aside>
      <WebsiteSettingCard
        title="Default Language"
        description="HTML document language attribute applied site-wide."
        fields={[
          { label: 'Language Code', value: settings.general.defaultLanguage },
          { label: 'HTML Attribute', value: `lang="${settings.general.defaultLanguage}"` },
        ]}
        editable
        onEdit={() => onEdit('general-identity')}
      />
    </SectionGroup>
  );
}

function SearchSection({ settings, onEdit }) {
  return (
    <SectionGroup title="Search Configuration">
      <WebsiteSettingCard
        title="Search Availability"
        description="Site-wide search is available via the navbar overlay and dedicated search page."
        fields={[
          {
            label: 'Status',
            value: settings.search.available ? 'Enabled' : 'Disabled',
          },
          { label: 'Search Page', value: '/search' },
          { label: 'Navbar Overlay', value: 'Available on all pages' },
        ]}
        status={settings.search.available ? 'published' : 'draft'}
      />
      <WebsiteSettingCard
        title="Indexed Content"
        description="Search index is built dynamically on the server from projects, services, careers, and pages."
        fields={[
          { label: 'Index Source', value: 'Public search API' },
          { label: 'Results Limit', value: String(settings.search.resultsLimit ?? 50) },
        ]}
      />
      <WebsiteSettingCard
        title="Search Placeholders"
        description="Input placeholders used on the search page and navbar search overlay."
        fields={[
          { label: 'Page Placeholder', value: settings.search.pagePlaceholder },
          { label: 'Overlay Placeholder', value: settings.search.overlayPlaceholder },
          { label: 'Overlay Subtitle', value: settings.search.overlaySubtitle },
        ]}
        editable
        onEdit={() => onEdit('search-placeholders')}
      />
      <WebsiteSettingCard
        title="Search Limits"
        description="Maximum suggestions and results returned by the client-side search index."
        fields={[
          { label: 'Suggestions Limit', value: String(settings.search.suggestionsLimit) },
          { label: 'Results Limit', value: String(settings.search.resultsLimit) },
        ]}
        editable
        onEdit={() => onEdit('search-limits')}
      />
    </SectionGroup>
  );
}

function IntegrationsSection({ settings, onEdit }) {
  return (
    <SectionGroup title="Third-Party Services">
      <WebsiteSettingCard
        title="Google Maps"
        description="Map embed on Reach Out page and external link on Connect page."
        fields={[
          {
            label: 'Embed URL',
            value: settings.integrations.googleMapsEmbedUrl
              ? `${settings.integrations.googleMapsEmbedUrl.slice(0, 60)}…`
              : 'Not configured',
            mono: true,
          },
          {
            label: 'External Link',
            value: settings.integrations.googleMapsExternalUrl || 'Not configured',
            mono: true,
          },
        ]}
        status={settings.integrations.googleMapsEmbedUrl ? 'published' : 'draft'}
        editable
        onEdit={() => onEdit('integrations-maps')}
      />
      <WebsiteSettingCard
        title="Social Links"
        description="Facebook, Instagram, and LinkedIn URLs used in footer and Connect page."
        fields={[]}
        managedNote="Managed in Navigation & Footer and Connect Page."
      />
      <WebsiteSettingCard
        title="Hero Video Source"
        description="Background video asset on the homepage hero section."
        fields={[
          { label: 'Video Path', value: settings.branding.heroVideo, mono: true },
        ]}
        managedNote="Managed in Home Page CMS — Hero section."
      />
      <Link to="/admin/connect-page" className={styles.manageLink}>
        <AdminIcon name="connect" size={14} />
        Manage Connect Page Links
      </Link>
    </SectionGroup>
  );
}

export default function WebsiteSettingsSectionContent({
  activeSection,
  settings,
  onEdit,
}) {
  switch (activeSection) {
    case 'general':
      return <GeneralSection settings={settings} onEdit={onEdit} />;
    case 'branding':
      return <BrandingSection settings={settings} onEdit={onEdit} />;
    case 'contact':
      return <ContactSection settings={settings} />;
    case 'localization':
      return <LocalizationSection settings={settings} onEdit={onEdit} />;
    case 'search':
      return <SearchSection settings={settings} onEdit={onEdit} />;
    case 'integrations':
      return <IntegrationsSection settings={settings} onEdit={onEdit} />;
    default:
      return null;
  }
}
