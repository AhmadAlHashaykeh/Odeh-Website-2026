import { usePageMeta } from '../../../../hooks/usePageMeta';
import { useAdminBreadcrumbs } from '../../cms/hooks/useAdminBreadcrumbs';
import { PageHeader, StatisticsStrip, ActionFeedback } from '../../cms/components';
import { useAboutPagesCms } from '../hooks/useAboutPagesCms';
import {
  aboutPagesMeta,
  aboutSectionNav,
  getPanelsForSection,
  getTeamOverviewStats,
  getActivitiesOverviewStats,
} from '../mock/aboutPagesConfig';
import AboutSectionNav from '../components/AboutSectionNav';
import AboutContentPanel from '../components/AboutContentPanel';
import AboutSectionEditModal from '../components/AboutSectionEditModal';
import TeamOverviewCard from '../components/TeamOverviewCard';
import ActivitiesOverviewCard from '../components/ActivitiesOverviewCard';
import AboutPagesSkeleton from '../components/AboutPagesSkeleton';
import styles from './AboutPagesCmsPage.module.css';

const teamStats = getTeamOverviewStats();
const activitiesStats = getActivitiesOverviewStats();

export default function AboutPagesCmsPage() {
  const cms = useAboutPagesCms();

  useAdminBreadcrumbs(aboutPagesMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${aboutPagesMeta.title} — ODEH Admin`,
    description: aboutPagesMeta.description,
  });

  const secondaryActions = aboutPagesMeta.secondaryActions.map((action) => ({
    ...action,
    onClick:
      action.label === 'Preview About'
        ? cms.previewAbout
        : cms.saveDraft,
  }));

  const panels = getPanelsForSection(cms.activeSection);

  const renderSectionContent = () => {
    return (
      <div className={styles.panels}>
        {panels.map((panel) => (
          <AboutContentPanel
            key={panel.id}
            panel={panel}
            panelData={cms.getPanelDataByDefinition(panel)}
            onEdit={cms.openEdit}
            onPreview={cms.previewPanel}
            onReset={cms.resetPanel}
          />
        ))}
        {cms.activeSection === 'team' ? <TeamOverviewCard stats={teamStats} /> : null}
        {cms.activeSection === 'activities' ? (
          <ActivitiesOverviewCard stats={activitiesStats} />
        ) : null}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={aboutPagesMeta.title}
        description={aboutPagesMeta.description}
        breadcrumbs={aboutPagesMeta.breadcrumbs}
        secondaryActions={secondaryActions}
      />

      {cms.isLoading ? (
        <AboutPagesSkeleton />
      ) : (
        <div className={styles.content}>
          <StatisticsStrip statistics={cms.statistics} />

          <div className={styles.layout}>
            <AboutSectionNav
              sections={aboutSectionNav}
              activeSection={cms.activeSection}
              onSelect={cms.setActiveSection}
            />

            <div className={styles.mainArea}>
              {renderSectionContent()}
            </div>
          </div>
        </div>
      )}

      <AboutSectionEditModal
        open={Boolean(cms.editingPanelId)}
        panelId={cms.editingPanelId}
        panelData={cms.editingPanelData}
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
