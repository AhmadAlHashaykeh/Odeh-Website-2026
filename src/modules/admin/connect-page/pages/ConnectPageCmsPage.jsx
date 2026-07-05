import { usePageMeta } from '../../../../hooks/usePageMeta';
import { useAdminBreadcrumbs } from '../../cms/hooks/useAdminBreadcrumbs';
import { PageHeader, StatisticsStrip, ActionFeedback } from '../../cms/components';
import { useConnectPageCms } from '../hooks/useConnectPageCms';
import { connectPageMeta, connectPanelDefinitions } from '../mock/connectPageConfig';
import ConnectPagePreview from '../components/ConnectPagePreview';
import ConnectLinkPanel from '../components/ConnectLinkPanel';
import ConnectPageEditModal from '../components/ConnectPageEditModal';
import ConnectPageSkeleton from '../components/ConnectPageSkeleton';
import styles from './ConnectPageCmsPage.module.css';

export default function ConnectPageCmsPage() {
  const cms = useConnectPageCms();

  useAdminBreadcrumbs(connectPageMeta.topBarBreadcrumbs);

  usePageMeta({
    title: `${connectPageMeta.title} — ODEH Admin`,
    description: connectPageMeta.description,
  });

  const secondaryActions = connectPageMeta.secondaryActions.map((action) => ({
    ...action,
    onClick:
      action.label === 'Preview Connect Page'
        ? cms.previewConnectPage
        : cms.saveDraft,
  }));

  const editType = cms.editingHeader
    ? 'header'
    : cms.editingLink
      ? connectPanelDefinitions.find((panel) => panel.linkIds.includes(cms.editingLink.id))
          ?.editType ?? 'link'
      : null;

  return (
    <div className={styles.page}>
      <PageHeader
        title={connectPageMeta.title}
        description={connectPageMeta.description}
        breadcrumbs={connectPageMeta.breadcrumbs}
        secondaryActions={secondaryActions}
      />

      {cms.isLoading ? (
        <ConnectPageSkeleton />
      ) : (
        <div className={styles.content}>
          <StatisticsStrip statistics={cms.statistics} />

          <div className={styles.layout}>
            <aside className={styles.previewArea} aria-label="Connect page preview">
              <span className={styles.previewLabel}>Live Preview</span>
              <ConnectPagePreview hero={cms.cmsData.hero} links={cms.enabledLinks} />
            </aside>

            <div className={styles.panelsArea}>
              {connectPanelDefinitions.map((panel) => (
                <ConnectLinkPanel
                  key={panel.id}
                  panel={panel}
                  links={cms.getPanelLinks(panel.id)}
                  hero={cms.cmsData.hero}
                  onEditHeader={cms.openEditHeader}
                  onEditLink={cms.openEditLink}
                  onPreviewLink={cms.previewLink}
                  onToggleEnabled={cms.toggleLinkEnabled}
                  onCopyUrl={cms.copyLinkUrl}
                  onResetLink={cms.resetLink}
                  onResetHeader={cms.resetHeader}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <ConnectPageEditModal
        open={Boolean(cms.editingHeader || cms.editingLink)}
        editType={editType}
        linkData={cms.editingLink}
        headerData={cms.editingHeaderData}
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
