import { usePageMeta } from '../../../../hooks/usePageMeta';
import { useAdminBreadcrumbs } from '../../cms/hooks/useAdminBreadcrumbs';
import { PageHeader, StatisticsStrip, ActionFeedback } from '../../cms/components';
import AboutSectionNav from '../../about-pages/components/AboutSectionNav';
import { useNavigationFooterCms } from '../hooks/useNavigationFooterCms';
import {
  navigationFooterMeta,
  navigationFooterSectionNav,
  getPanelsForSection,
} from '../mock/navigationFooterConfig';
import NavigationFooterContentPanel from '../components/NavigationFooterContentPanel';
import NavigationFooterEditModal from '../components/NavigationFooterEditModal';
import NavigationFooterSkeleton from '../components/NavigationFooterSkeleton';
import GlobalCtaNotice from '../components/GlobalCtaNotice';
import styles from './NavigationFooterCmsPage.module.css';

export default function NavigationFooterCmsPage() {
  const cms = useNavigationFooterCms();

  useAdminBreadcrumbs(navigationFooterMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${navigationFooterMeta.title} — ODEH Admin`,
    description: navigationFooterMeta.description,
  });

  const secondaryActions = navigationFooterMeta.secondaryActions.map((action) => ({
    ...action,
    onClick:
      action.label === 'Preview Website'
        ? cms.previewWebsite
        : cms.saveDraft,
  }));

  const panels = getPanelsForSection(cms.activeSection, cms.cmsData);

  const handleEditNavItem = (panelId, navItemId) => {
    cms.openEdit(panelId, navItemId);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={navigationFooterMeta.title}
        description={navigationFooterMeta.description}
        breadcrumbs={navigationFooterMeta.breadcrumbs}
        secondaryActions={secondaryActions}
      />

      {cms.isLoading ? (
        <NavigationFooterSkeleton />
      ) : (
        <div className={styles.content}>
          <StatisticsStrip statistics={cms.statistics} />

          <div className={styles.layout}>
            <AboutSectionNav
              sections={navigationFooterSectionNav}
              activeSection={cms.activeSection}
              onSelect={cms.setActiveSection}
            />

            <div className={styles.mainArea}>
              {cms.activeSection === 'global-cta' ? (
                <GlobalCtaNotice />
              ) : (
                <div className={styles.panels}>
                  {panels.map((panel) => (
                    <NavigationFooterContentPanel
                      key={panel.id}
                      panel={panel}
                      panelData={cms.getPanelDataByDefinition(panel)}
                      onEdit={cms.openEdit}
                      onEditNavItem={handleEditNavItem}
                      onPreview={cms.previewPanel}
                      onReset={cms.resetPanel}
                      onPreviewSocial={cms.previewSocial}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <NavigationFooterEditModal
        open={Boolean(cms.editingPanelId)}
        panelId={cms.editingPanelId}
        panelData={cms.editingPanelData}
        editingNavItemId={cms.editingNavItemId}
        onClose={cms.closeEdit}
        onSave={cms.savePanel}
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
