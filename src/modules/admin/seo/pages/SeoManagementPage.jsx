import { usePageMeta } from '../../../../hooks/usePageMeta';
import { useAdminBreadcrumbs } from '../../cms/hooks/useAdminBreadcrumbs';
import { PageHeader, StatisticsStrip, ActionFeedback } from '../../cms/components';
import { useSeoManagement } from '../hooks/useSeoManagement';
import { seoManagementMeta } from '../mock/seoConfig';
import SeoModulePicker from '../components/SeoModulePicker';
import SeoModuleSwitcher from '../components/SeoModuleSwitcher';
import SeoStatsScopeSwitch from '../components/SeoStatsScopeSwitch';
import SeoPageList from '../components/SeoPageList';
import SeoInspector from '../components/SeoInspector';
import SeoEditModal from '../components/SeoEditModal';
import SeoAuditPanel from '../components/SeoAuditPanel';
import SeoManagementSkeleton from '../components/SeoManagementSkeleton';
import styles from './SeoManagementPage.module.css';

export default function SeoManagementPage() {
  const seo = useSeoManagement();
  const inModuleWorkspace = Boolean(seo.selectedModuleId);

  useAdminBreadcrumbs(seoManagementMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${seoManagementMeta.title} — ODEH Admin`,
    description: seoManagementMeta.description,
  });

  const secondaryActions = seoManagementMeta.secondaryActions.map((action) => ({
    ...action,
    onClick: seo.toggleAuditPanel,
  }));

  return (
    <div className={styles.page}>
      <PageHeader
        title={seoManagementMeta.title}
        description={seoManagementMeta.description}
        breadcrumbs={seoManagementMeta.breadcrumbs}
        secondaryActions={secondaryActions}
        primaryAction={{
          ...seoManagementMeta.primaryAction,
          onClick: seo.saveDraft,
        }}
      />

      {seo.isLoading ? (
        <SeoManagementSkeleton />
      ) : (
        <div className={styles.content}>
          <div className={styles.statsRow}>
            <StatisticsStrip statistics={seo.statistics} />
            <SeoStatsScopeSwitch
              value={seo.statsScope}
              onChange={seo.setStatsScope}
              moduleSelected={inModuleWorkspace}
            />
          </div>

          {seo.showAuditPanel && (
            <div className={styles.auditSlideDown}>
              <SeoAuditPanel
                page={seo.selectedPage}
                siteSummary={seo.siteAuditSummary}
                visible
              />
            </div>
          )}

          {!inModuleWorkspace ? (
            <SeoModulePicker modules={seo.moduleSummaries} onSelect={seo.selectModule} />
          ) : (
            <div className={styles.workspace}>
              <SeoPageList
                module={seo.selectedModule}
                pageSections={seo.pageSections}
                selectedPageId={seo.selectedPageId}
                searchQuery={seo.searchQuery}
                searchAllModules={seo.searchAllModules}
                onSearchChange={seo.setSearchQuery}
                onSearchAllModulesChange={seo.setSearchAllModules}
                onSelect={seo.selectPage}
              />

              <SeoInspector
                page={seo.selectedPage}
                onEdit={seo.openEdit}
                onPreview={seo.openPage}
                onCopyUrl={seo.copyPageUrl}
                onOpenPage={seo.openPage}
                onReset={seo.resetPage}
              />
            </div>
          )}
        </div>
      )}

      <SeoEditModal
        open={Boolean(seo.editingPage)}
        page={seo.editingPage}
        onClose={seo.closeEdit}
        onSave={seo.saveEdit}
      />

      <ActionFeedback
        open={seo.feedback.open}
        message={seo.feedback.message}
        type={seo.feedback.type}
        onClose={seo.closeFeedback}
      />
    </div>
  );
}
