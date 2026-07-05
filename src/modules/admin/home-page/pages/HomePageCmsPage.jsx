import { usePageMeta } from '../../../../hooks/usePageMeta';
import { useAdminBreadcrumbs } from '../../cms/hooks/useAdminBreadcrumbs';
import { PageHeader, StatisticsStrip, ActionFeedback } from '../../cms/components';
import { useHomePageCms } from '../hooks/useHomePageCms';
import { homePageMeta, sectionDefinitions } from '../mock/homePageConfig';
import HomePageSectionPanel from '../components/HomePageSectionPanel';
import HomePageSectionEditModal from '../components/HomePageSectionEditModal';
import HomePageSkeleton from '../components/HomePageSkeleton';
import FooterNoticeCard from '../components/FooterNoticeCard';
import styles from './HomePageCmsPage.module.css';

export default function HomePageCmsPage() {
  const cms = useHomePageCms();

  useAdminBreadcrumbs(homePageMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${homePageMeta.title} — ODEH Admin`,
    description: homePageMeta.description,
  });

  const secondaryActions = homePageMeta.secondaryActions.map((action) => ({
    ...action,
    onClick:
      action.label === 'Preview Homepage'
        ? cms.previewHomepage
        : cms.saveDraft,
  }));

  const editingData = cms.editingSectionId
    ? cms.sections[cms.editingSectionId]
    : null;

  return (
    <div className={styles.page}>
      <PageHeader
        title={homePageMeta.title}
        description={homePageMeta.description}
        breadcrumbs={homePageMeta.breadcrumbs}
        secondaryActions={secondaryActions}
      />

      {cms.isLoading ? (
        <HomePageSkeleton />
      ) : (
        <div className={styles.content}>
          <StatisticsStrip statistics={cms.statistics} />

          <div className={styles.sections}>
            {sectionDefinitions.map((definition) => (
              <HomePageSectionPanel
                key={definition.id}
                definition={definition}
                sectionData={cms.sections[definition.id]}
                onEdit={cms.openEdit}
                onPreview={cms.previewSection}
                onReset={cms.resetSection}
                onCopyLink={cms.copySectionLink}
              />
            ))}
          </div>

          <FooterNoticeCard />
        </div>
      )}

      <HomePageSectionEditModal
        open={Boolean(cms.editingSectionId)}
        sectionId={cms.editingSectionId}
        sectionData={editingData}
        onClose={cms.closeEdit}
        onSave={cms.saveSection}
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
