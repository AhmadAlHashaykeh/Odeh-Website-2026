import { usePageMeta } from '../../../../hooks/usePageMeta';
import { useAdminBreadcrumbs } from '../../cms/hooks/useAdminBreadcrumbs';
import { PageHeader, StatisticsStrip, ActionFeedback } from '../../cms/components';
import AboutSectionNav from '../../about-pages/components/AboutSectionNav';
import { useWebsiteSettings } from '../hooks/useWebsiteSettings';
import {
  websiteSettingsMeta,
  websiteSettingsSectionNav,
} from '../mock/websiteSettingsConfig';
import WebsiteSettingsSectionContent from '../components/WebsiteSettingsSectionContent';
import WebsiteSettingsEditModal from '../components/WebsiteSettingsEditModal';
import WebsiteSettingsSkeleton from '../components/WebsiteSettingsSkeleton';
import styles from './WebsiteSettingsPage.module.css';

export default function WebsiteSettingsPage() {
  const cms = useWebsiteSettings();

  useAdminBreadcrumbs(websiteSettingsMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${websiteSettingsMeta.title} — ODEH Admin`,
    description: websiteSettingsMeta.description,
  });

  const secondaryActions = websiteSettingsMeta.secondaryActions.map((action) => ({
    ...action,
    onClick:
      action.label === 'Preview Website'
        ? cms.previewWebsite
        : cms.saveDraft,
  }));

  return (
    <div className={styles.page}>
      <PageHeader
        title={websiteSettingsMeta.title}
        description={websiteSettingsMeta.description}
        breadcrumbs={websiteSettingsMeta.breadcrumbs}
        secondaryActions={secondaryActions}
      />

      {cms.isLoading ? (
        <WebsiteSettingsSkeleton />
      ) : (
        <div className={styles.content}>
          <StatisticsStrip statistics={cms.statistics} />

          <div className={styles.layout}>
            <AboutSectionNav
              sections={websiteSettingsSectionNav}
              activeSection={cms.activeSection}
              onSelect={cms.setActiveSection}
              ariaLabel="Website settings sections"
            />

            <div className={styles.mainArea}>
              <WebsiteSettingsSectionContent
                activeSection={cms.activeSection}
                settings={cms.settings}
                onEdit={cms.openEdit}
              />
            </div>
          </div>
        </div>
      )}

      <WebsiteSettingsEditModal
        open={Boolean(cms.editingKey)}
        editKey={cms.editingKey}
        settings={cms.settings}
        onClose={cms.closeEdit}
        onSave={cms.saveEdit}
      />

      <ActionFeedback
        open={cms.feedback.open}
        message={cms.feedback.message}
        type={cms.feedback.type}
        onClose={cms.closeFeedback}
      />
    </div>
  );
}
