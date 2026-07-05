import { usePageMeta } from '../../../../hooks/usePageMeta';
import { useAdminBreadcrumbs } from '../../cms/hooks/useAdminBreadcrumbs';
import { PageHeader, StatisticsStrip, ActionFeedback } from '../../cms/components';
import { useLegalPagesCms } from '../hooks/useLegalPagesCms';
import { legalPagesMeta } from '../mock/legalPagesConfig';
import LegalDocumentCard from '../components/LegalDocumentCard';
import LegalPagePreviewDrawer from '../components/LegalPagePreviewDrawer';
import LegalPageEditModal from '../components/LegalPageEditModal';
import LegalPagesSkeleton from '../components/LegalPagesSkeleton';
import styles from './LegalPagesCmsPage.module.css';

export default function LegalPagesCmsPage() {
  const cms = useLegalPagesCms();

  useAdminBreadcrumbs(legalPagesMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${legalPagesMeta.title} — ODEH Admin`,
    description: legalPagesMeta.description,
  });

  const secondaryActions = legalPagesMeta.secondaryActions.map((action) => ({
    ...action,
    onClick: action.label === 'Preview' ? cms.previewFirstPage : cms.saveDraft,
  }));

  return (
    <div className={styles.page}>
      <PageHeader
        title={legalPagesMeta.title}
        description={legalPagesMeta.description}
        breadcrumbs={legalPagesMeta.breadcrumbs}
        secondaryActions={secondaryActions}
      />

      {cms.isLoading ? (
        <LegalPagesSkeleton />
      ) : (
        <div className={styles.content}>
          <StatisticsStrip statistics={cms.statistics} />

          <div className={styles.workspace}>
            <div className={styles.cards} role="list" aria-label="Legal documents">
              {cms.pages.map((page) => (
                <LegalDocumentCard
                  key={page.id}
                  page={page}
                  isActive={cms.previewPageId === page.id}
                  onSelect={cms.openPreview}
                  onEdit={cms.openEdit}
                  onPreview={cms.openPreview}
                  onCopyUrl={cms.copyPageUrl}
                  onReset={cms.resetPage}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <LegalPagePreviewDrawer
        page={cms.previewPage}
        onClose={cms.closePreview}
        onPreviewWebsite={cms.previewWebsite}
      />

      <LegalPageEditModal
        open={Boolean(cms.editingPage)}
        page={cms.editingPage}
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
